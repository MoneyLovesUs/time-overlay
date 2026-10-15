// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mock = vi.hoisted(()=>({quote:vi.fn()}));
vi.mock("@/lib/pro/client",()=>({fetchProQuote:mock.quote}));
import { ProPaywallModal } from "@/components/generator/pro-paywall-modal";
import { regionalPrice, type PriceQuote } from "@/lib/pro/regional-pricing";
function quote(country="IN"):PriceQuote {
  return {...regionalPrice(country),policyVersion:"regional-v1",expiresAt:Math.floor(Date.now()/1000)+900,quoteToken:"signed-"+country};
}
let root:Root, container:HTMLDivElement;
const checkout=vi.fn();
async function render(open=true) {
  await act(async()=>{root.render(<ProPaywallModal open={open} trigger={open?"duration":null}
    onClose={()=>{}} onCheckout={checkout} onRestore={async()=>"not_found"} />);});
}
function button(text:string) {return [...container.querySelectorAll("button")].find(b=>b.textContent===text)!;}
async function click(text:string) {await act(async()=>button(text).click());}
describe("regional paywall interaction",()=>{
  beforeEach(()=>{
    (globalThis as {IS_REACT_ACT_ENVIRONMENT?:boolean}).IS_REACT_ACT_ENVIRONMENT=true;
    container=document.createElement("div"); document.body.append(container); root=createRoot(container);
    checkout.mockResolvedValue("error"); mock.quote.mockResolvedValue(quote());
  });
  afterEach(async()=>{await act(async()=>root.unmount());container.remove();vi.resetAllMocks();});
  it("displays the actual price, labels regional pricing and submits that exact quote",async()=>{
    const q=quote("CN"); mock.quote.mockResolvedValue(q);
    await render();
    expect(container.textContent).toContain("$5.40 one-time payment");
    expect(container.textContent).toContain("Regional pricing applied.");
    expect(container.textContent).not.toContain("$9 one-time");
    await click("Unlock Pro");
    expect(checkout).toHaveBeenCalledWith("duration",q);
  });
  it("disables checkout while loading and when the quote fails, with retry and restore still available",async()=>{
    let resolve:(q:PriceQuote|null)=>void=()=>{};
    mock.quote.mockImplementationOnce(()=>new Promise(r=>{resolve=r;}));
    await render();
    expect(button("Unlock Pro").disabled).toBe(true);
    expect(container.textContent).toContain("Loading price");
    expect(container.textContent).toContain("Restore purchase");
    await act(async()=>resolve(null));
    expect(button("Unlock Pro").disabled).toBe(true);
    expect(container.textContent).toContain("Payments are temporarily unavailable");
    await click("Retry price");
    expect(button("Unlock Pro").disabled).toBe(false);
  });
  it("refreshes a changed quote but never automatically checks out at the new price",async()=>{
    await render();
    checkout.mockResolvedValueOnce("quote_changed");
    mock.quote.mockResolvedValueOnce(quote("US"));
    await click("Unlock Pro");
    expect(container.textContent).toContain("$9.00");
    expect(container.textContent).toContain("Price updated");
    expect(checkout).toHaveBeenCalledTimes(1);
    await click("Unlock Pro");
    expect(checkout).toHaveBeenCalledTimes(2);
  });
  it("aborts a quote on close and gets a fresh price when reopened",async()=>{
    let resolve:(q:PriceQuote|null)=>void=()=>{};
    mock.quote.mockImplementationOnce(()=>new Promise(r=>{resolve=r;}));
    await render();
    const signal=mock.quote.mock.calls[0][0] as AbortSignal;
    await render(false);
    expect(signal.aborted).toBe(true);
    mock.quote.mockResolvedValueOnce(quote("CN"));
    await render();
    await act(async()=>resolve(quote("IN")));
    expect(container.textContent).toContain("$5.40");
    expect(container.textContent).not.toContain("$3.60");
  });
  it("does not submit an expired quote and prevents repeated pending clicks",async()=>{
    mock.quote.mockResolvedValueOnce({...quote(),expiresAt:1});
    await render();
    await click("Unlock Pro");
    expect(checkout).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Price updated");
    let resolve:(value:string)=>void=()=>{};
    checkout.mockImplementationOnce(()=>new Promise(r=>{resolve=r;}));
    await click("Unlock Pro");
    expect(button("...").disabled).toBe(true);
    await act(async()=>{button("...").click();});
    expect(checkout).toHaveBeenCalledTimes(1);
    await act(async()=>resolve("error"));
  });
});

