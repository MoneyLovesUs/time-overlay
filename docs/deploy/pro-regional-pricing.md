# Pro 区域定价配置与发布

规格：../superpowers/specs/2026-10-14-pro-regional-pricing.md。

## 现状

代码实现，默认关闭；尚未配置正式优惠券或部署。账户已只读核对为 Pocket Tools Inc (acct_1TNWqFPuE0QRKBbW)，正式 Product prod_VQxSWpuY6vYwgD、Price price_1UQ5aBPuE0QRKBbWTY6IJnLT 是 active/live/USD900/one_time。

本地代码与 DOM/mock Stripe 测试不能代替 Sandbox 付款验收。当前只掌握已授权 live 凭据，未执行 Sandbox 付款、真实付款或退款。地区 header 可信性还需 Preview 上用测试出口和伪造请求验证；完成前不能开启生产折扣。

## 1. 创建优惠券之前

- 获得本次三个地区优惠券创建的明确授权；不沿用旧 rollout D 的“只能新建一个产品/价格”权限。
- 正式 Product/Price 不新增、不修改。三个 Coupon 仅限 Time Overlay Pro。
- 保留所有无关Stripe/Vercel设置；不修改全局换汇、支付方式、税率。
- 凭据仅通过已授权提供方或 owner-only 文件在内存中读取；不在命令行中写明值。
- 先准备隔离 Sandbox 凭据及对应测试Product/Price，完成下面测试模式流程。

## 2. 配置脚本

在仓库执行 pnpm pro:coupons --help 查看参数。省略 --apply 就是只读，绝不创建对象。

测试模式示例（ID替换为实际核对过的Sandbox资源，STRIPE_SECRET_KEY由私有环境注入）：

    pnpm pro:coupons --mode=test --account=acct_TEST --product=prod_TEST --price=price_TEST

核对输出及授权后，加 --apply 执行。脚本对现有固定ID核对所有属性；冲突停止，不覆盖。超时先读取同一个ID，避免重复创建。部分完成后可再次执行，已核对的对象复用。

正式只读检查命令：

    pnpm pro:coupons --mode=live --account=acct_1TNWqFPuE0QRKBbW --product=prod_VQxSWpuY6vYwgD --price=price_1UQ5aBPuE0QRKBbWTY6IJnLT

正式创建在上述命令最后加 --apply，仅在本次创建操作获准后运行。安全输出只包括ID、比例、tier、product、mode、动作；没有secret。

生成对象及环境映射：

| 服务端环境变量 | ID |
|---|---|
| STRIPE_PRO_REGIONAL_COUPON_20 | to_pro_regional_v1_off20 |
| STRIPE_PRO_REGIONAL_COUPON_40 | to_pro_regional_v1_off40 |
| STRIPE_PRO_REGIONAL_COUPON_60 | to_pro_regional_v1_off60 |

## 3. 服务端环境

新增：
- PRO_REGIONAL_PRICING_ENABLED=false（默认）。
- 上述三个Coupon映射（mode必须与key/Price匹配）。
- PRO_PRICING_QUOTE_SECRET：独立、至少32字节高熵密钥，放Vercel Sensitive服务端变量；不要复用或轮换PRO_LICENSE_SECRET。

保持 STRIPE_SECRET_KEY、STRIPE_PRO_PRICE_ID、PRO_LICENSE_SECRET 原值。本地不把真实key放仓库。
开启时，缺配置或provider对象不符返回503，不以全价替代优惠。

Sandbox用专属分支Preview/隔离测试项目配置test key/test Price/test Coupon，不覆盖全局Preview现有live配置。新变量在新部署中生效。

## 4. 验收

    pnpm run test --run
    pnpm pro:coupons:test
    pnpm lint
    pnpm exec tsc --noEmit
    pnpm build

UI DOM测试使用 jsdom（开发依赖，项目Node24 runtime满足其要求）。

Sandbox四档：
- US：900，无自动Coupon，可手动输入活动码。
- MY：720，off20。
- CN：540，off40。
- IN：360，off60。

检查 quote no-store、checkout USD、adaptive_pricing=false、discounts与allow_promotion_codes不同时出现、UI金额一致。优惠档不能手动叠加其他促销码。

用Stripe测试卡付款，确认paid、返回解锁、恢复、旧订单；取消/失败不解锁。价格变化或token失效应409、重新展示并等待再次点击。

平台地理识别要求 VERCEL=1；本地客户端提交 country/amount 不改变价格。功能之外无地区覆盖调试接口。生产可信性不能用手动注入header的单测证明。

## 5. 发布与回滚

代码push/PR不等于发布，合并/生产配置/发布按本次明确授权执行。
先部署flag=false并观测，完成Sandbox和地理入口验收后flag=true并再次发布。
发布走 docs/deploy/local-prebuilt-release.md 的 pnpm release:solo，从干净同步main完成；观察SHA、READY、别名和HTTP健康。

rollback：flag=false并新部署，或按正式发布文档恢复已验证旧部署。不要删除Coupon/Price/付款历史。旧优惠token被拒绝重新报价；已创建的正常Stripe Session保留原价格；旧Pro token不受影响。

真实付款/退款需要当次明确授权。现有退款不自动撤销本地签名Pro token，区域定价没有新增退款撤权。

## 6. 交接

记录最终PR/SHA、非敏感Stripe对象ID、部署ID、测试与真实集成证据。
明确区分本地/mock、Sandbox、Preview、Production和用户真实付款。
未配置live Coupon或未启用部署时，不能说“区域价格已上线”。

