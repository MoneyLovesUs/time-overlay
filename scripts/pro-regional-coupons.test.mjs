import assert from "node:assert/strict";
import { test } from "node:test";
import { COUPONS, provisionCoupons } from "./pro-regional-coupons.mjs";
function fixture() {
  const store = new Map();
  let creates = 0;
  const client = {
    accounts: {retrieve:async()=>({id:"acct_test"})},
    products: {retrieve:async()=>({id:"prod_test",active:true,livemode:false,metadata:{product:"time-overlay-pro"}})},
    prices: {retrieve:async()=>({id:"price_test",active:true,livemode:false,currency:"usd",unit_amount:900,type:"one_time",product:"prod_test"})},
    coupons: {
      retrieve:async(id)=>{
        if (!store.has(id)) throw Object.assign(new Error("missing"),{code:"resource_missing",statusCode:404});
        return store.get(id);
      },
      create:async(params)=>{
        creates++;
        const coupon={...params,valid:true,livemode:false,amount_off:null,max_redemptions:null,redeem_by:null};
        store.set(params.id,coupon);
        return coupon;
      },
    },
  };
  return {client,store,creates:()=>creates};
}
const opts={mode:"test",accountId:"acct_test",productId:"prod_test",priceId:"price_test"};
test("default dry run never creates objects; apply creates only three reusable product-limited coupons", async()=>{
  const f=fixture();
  const preview=await provisionCoupons(f.client,opts);
  assert.equal(f.creates(),0);
  assert.ok(preview.every(c=>c.action==="would_create"));
  await provisionCoupons(f.client,{...opts,apply:true});
  assert.equal(f.creates(),3);
  await provisionCoupons(f.client,{...opts,apply:true});
  assert.equal(f.creates(),3);
  for(const c of f.store.values()) assert.deepEqual(c.applies_to.products,["prod_test"]);
});
test("identity mismatch and existing conflicts stop before any write",async()=>{
  const f=fixture();
  await assert.rejects(provisionCoupons(f.client,{...opts,accountId:"other",apply:true}),/account/);
  await assert.rejects(provisionCoupons(f.client,{...opts,mode:"live",apply:true}),/identity/);
  f.store.set(COUPONS[2].id,{valid:false});
  await assert.rejects(provisionCoupons(f.client,{...opts,apply:true}),/conflict/);
  assert.equal(f.creates(),0);
});
test("a timeout retrieves the same fixed coupon id instead of creating a duplicate",async()=>{
  const f=fixture();
  const create=f.client.coupons.create;
  f.client.coupons.create=async(params)=>{await create(params); throw new Error("timeout");};
  await provisionCoupons(f.client,{...opts,apply:true});
  assert.equal(f.creates(),3);
  assert.equal(f.store.size,3);
});

