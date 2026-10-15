# Time Overlay Pro 区域定价工程规格

- 日期：2026-10-14
- 状态：代码已实现，待评审及环境集成验收；Stripe/Vercel 正式配置和发布尚未执行。
- 目标：美国基准 USD 9.00，一次性购买；按访问国家自动应用地区优惠，所有档位权益相同。
- 本次用户授权：已从编写 spec 扩展到代码实现。live 优惠券创建、生产变量配置、合并及发布保留执行前确认；本文不扩大账户操作授权。
- 既有规范：docs/superpowers/specs/2026-10-12-mobile-mp4-and-pro-plan.md。
- 已核对当前 checkout、verify、restore、validate、config、client 与付费弹窗源码。外部账户标识来自 rollout 记录，执行前必须重新只读验证。

## 1. 产品决策与范围

采用：一个现有 Product + 一个现有 USD Price + 三个产品限定 Coupon + 服务端国家规则表。

Stripe 提供折扣计算和收款；国家归档由本站维护。无需新建各国产品、各国 Price、价格数据库、订阅或第三方 PPP 服务。

v1 统一美元展示和结账，分别为 $9.00 / $7.20 / $5.40 / $3.60。为确保报价与结账一致，新版 Checkout Session 明确 currency=usd、adaptive_pricing.enabled=false；不修改账户级 Adaptive Pricing 开关。未来本币换汇另立变更。

不引入税务策略变更；核对现有 Price.tax_behavior 与结账税配置。v1 对 exclusive tax Price 或多币种 Price 拒绝开启地区定价，结账仍不启用 automatic_tax，且校验新建 Session tax=0。若现有环境需要附加税，应先补报价税费设计并另行验收，不能修改现有税设置来绕过门禁。

不增加 VPN 检测、用户国家选择器、账单地址强制验证或身份认证。IP 定位是优惠分配信号，不是居住地证明；接受有限跨区购买风险。

## 2. 精确国家规则

policyVersion：regional-v1。金额以美分存储，禁止浮点金额运算。

| tier | 美国价比例 | percent_off | amount 美分 | 国家 ISO 3166-1 alpha-2 白名单 |
|---|---:|---:|---:|---|
| standard | 100% | 0 | 900 | 所有未列入优惠档的国家，以及未知国家 |
| regional_80 | 80% | 20 | 720 | PL CZ PT GR MY CL |
| regional_60 | 60% | 40 | 540 | CN BR MX TH TR ZA CO PE |
| regional_40 | 40% | 60 | 360 | IN ID PH VN PK BD EG NG |

特别说明：美国、加拿大、英国、澳大利亚、新西兰、德国、法国、北欧、日本、韩国、新加坡、香港、台湾、阿联酋等未在优惠白名单内，均为 standard。按国家明确枚举，不做“欧洲”“东南亚”等模糊匹配。

这是一版商业实验价格表，不是官方 PPP 指数。后续调价必须变更 policyVersion、更新测试并重新发布。未知国家默认标准价只适用于报价阶段；已给出的优惠报价不能在结账失败后偷偷变成标准价。

## 3. 现有资源与执行前检查

历史记录中的目标资源：

| 资源 | 预期标识 |
|---|---|
| Stripe 账户 | Pocket Tools Inc，acct_1TNWqFPuE0QRKBbW |
| 正式 Product | prod_VQxSWpuY6vYwgD，Time Overlay Pro |
| 正式 Price | price_1UQ5aBPuE0QRKBbWTY6IJnLT |
| Price 属性 | active、live、usd、unit_amount=900、one_time，属于上述 Product |
| Vercel project | time-overlay，prj_IHTU6bhE36lhZcooqWo50dQ3hjGy |
| Vercel team | team_nyAa8oJCujnSymAWbsZ0xiDl |

执行前 GET /v1/account、读取 Price 和 Product；同时确认 STRIPE_PRO_PRICE_ID 指向核对过的 Price。任何不一致都停止写操作并报告，禁止凭相似名称另建产品。

账户还有其他产品。不能更改其优惠券、价格、支付方式或全局设置。旧 Creator Pack、已归档重复商品不在本次操作范围。

密钥只从已授权的凭据提供方或受保护的本机环境读取；不要复制聊天历史中的密钥，不打印值，不写入仓库、PR、截图或执行报告。账户登录/OAuth/选账号、额度重置、升级、付款等弹窗交用户处理。

## 4. Stripe 配置操作手册

### 4.1 Sandbox 先行

先使用已授权的测试环境凭据。若没有测试环境访问权限，记录阻塞，请用户提供或授权；不可用 live 卡付款代替测试。

Live 和 Sandbox 对象不能混用。Sandbox 如果不存在对应商品，则只在 Sandbox 创建一个测试 Time Overlay Pro Product 和 900 usd one_time Price，并记录其 ID。正式环境复用既有 Product/Price。

### 4.2 新增三个 Coupon

建议固定 ID（每个 Stripe 模式分别创建）：

| id | name（客户可见） | percent_off |
|---|---|---:|
| to_pro_regional_v1_off20 | Regional pricing 20% off | 20 |
| to_pro_regional_v1_off40 | Regional pricing 40% off | 40 |
| to_pro_regional_v1_off60 | Regional pricing 60% off | 60 |

三个对象公共字段：

- duration=once。这里只描述订阅折扣时长语义，不表示全球只能使用一次；本项目为一次性付款。
- applies_to.products=[已核对的本环境 Time Overlay Pro Product ID]。
- metadata.product=time-overlay-pro。
- metadata.purpose=regional-pricing。
- metadata.policy_version=regional-v1。
- metadata.tier 分别 regional_80 / regional_60 / regional_40。
- 不设 max_redemptions、redeem_by；不设 amount_off 或 currency。
- 不创建任何公开 Promotion Code，不让用户输入地区码。
- 不创建 Customer 级永久折扣，不修改已存在订单。

推荐用 Stripe SDK/API 创建，便于精确限定商品和幂等执行。伪代码：

    await stripe.coupons.create({
      id: "to_pro_regional_v1_off40",
      name: "Regional pricing 40% off",
      percent_off: 40,
      duration: "once",
      applies_to: { products: [verifiedProductId] },
      metadata: {
        product: "time-overlay-pro",
        purpose: "regional-pricing",
        policy_version: "regional-v1",
        tier: "regional_60"
      }
    }, { idempotencyKey: "time-overlay:regional-v1:coupon:off40" });

创建前先 retrieve 固定 ID：存在且全部属性一致则复用；不存在才创建。存在但比例、product、mode 或 metadata 不符则停止，不覆盖或删除。请求超时后先 retrieve 再判断，禁止不核对结果就用新 ID 重建。

创建后逐个读取验证 id、livemode、valid、percent_off、applies_to.products、metadata。输出报告仅包含这些非敏感字段。

后台手工方式：在目标账户正确模式进入产品目录的 Coupons/优惠券管理，新建百分比优惠券，限制适用商品为 Time Overlay Pro，填写上表属性。若界面不支持自定义 ID，记录返回 ID 并映射到下节环境变量；不要同时再跑 API 重复创建。

### 4.3 Vercel 配置

保留现有 STRIPE_SECRET_KEY、STRIPE_PRO_PRICE_ID、PRO_LICENSE_SECRET，不轮换或覆盖。

新增服务端变量：
- PRO_REGIONAL_PRICING_ENABLED=false（初始值）。
- STRIPE_PRO_REGIONAL_COUPON_20=<本环境 Coupon ID>。
- STRIPE_PRO_REGIONAL_COUPON_40=<本环境 Coupon ID>。
- STRIPE_PRO_REGIONAL_COUPON_60=<本环境 Coupon ID>。
- PRO_PRICING_QUOTE_SECRET=<独立随机至少 32 字节密钥>。

所有变量均不使用 NEXT_PUBLIC_ 前缀。Quote secret 不复用 license secret；后续报价密钥轮换不会影响旧 Pro token。

Sandbox 验证用隔离的分支 Preview 配置或隔离测试项目；只给该范围绑定测试 key/Price/Coupon，不把整个现有 Preview 范围改成测试模式。现有 Preview 曾使用 live key，不能直接用测试卡在 live Checkout 测试。

Production 配置 live Coupon ID，先保持 flag=false。环境变量变更需要新的部署才生效；不能只修改 Dashboard 后声称已开启。配置前后比较变量名和目标范围，保护无关值。

## 5. 代码设计与文件清单

新增：
- src/lib/pro/regional-pricing.ts：纯函数国家归档、tier、金额和版本。
- src/lib/pro/pricing-quote.ts：签发与验证短期报价。
- src/app/api/pro/quote/route.ts：返回报价。
- tests/lib/pro/regional-pricing.test.ts。
- tests/lib/pro/pricing-quote.test.ts。
- tests/app/pro/quote.test.ts。

修改：
- src/lib/pro/pricing-server.ts：独立读取可选 regional 配置；src/lib/pro/config.ts 保持基础 Pro 配置契约，功能关闭时缺少新变量不会影响原接口。
- src/app/api/pro/checkout/route.ts：校验报价、绑定 Coupon、保存非敏感 metadata。
- src/lib/pro/client.ts：获取报价、提交 quoteToken、处理 409/503。
- src/components/generator/pro-paywall-modal.tsx：动态金额、加载/重报价/失败状态。
- src/components/generator/generator-shell.tsx：报价事件关联，保留既有 upsell 去重。
- src/content/root/types.ts、en.ts、zh-hans.ts：动态价格模板与错误提示。
- 对应 checkout/client/paywall/analytics 测试。

verify/restore/validate 默认不改权益契约。是否需要少量类型或测试适配按实测决定，不借机放宽支付校验。

实施前读取适用 AGENTS.md 和 node_modules/next/dist/docs/ 的 Route Handler、缓存相关指南。本项目 Next.js 16.2.3，Stripe SDK 23.0.0，不能按旧框架缓存默认值实现。

## 6. 国家识别与信任边界

仅服务端读取受信任 Vercel 边缘入口提供的 x-vercel-ip-country，规范化为大写 ISO 代码；缺失、非法、多值、XX 等未知值归 standard。

不能从请求 JSON、URL 参数、Accept-Language、UI locale、localStorage 或客户端设置的 country 选择优惠。应用外若存在反向代理，必须验证该入口不会让外来同名 header 冒充平台地理信息。

本地与测试可通过依赖注入传 country，禁止上线一个可通过 query/header 覆盖地区的调试后门。生产实测发送伪造地理 header，确认平台入口处理符合预期；无法证明可信则禁用优惠并报告，不部署可由客户端随意指定地区的方案。

报价、结账同时做 Origin 校验，使用部署来源允许列表，防止外站无意调用；它不作为强反机器人措施。

## 7. 报价 API 与一致性

GET /api/pro/quote，仅在用户打开付费弹窗时请求。返回示例：

    {
      "currency": "usd",
      "baseAmount": 900,
      "amount": 540,
      "discountPercent": 40,
      "tier": "regional_60",
      "country": "CN",
      "policyVersion": "regional-v1",
      "expiresAt": 1791981000,
      "quoteToken": "<signed opaque token>"
    }

expiresAt 示例仅表示 Unix 秒；实际取服务端当前时间 + 15 分钟。

开关关闭时，quote 返回 standard/900、policyVersion=standard-v1、quoteToken=null、expiresAt=null，不要求新报价密钥或Coupon配置；客户端按兼容的标准价流程提交。开关开启但缺少Quote secret或Coupon映射时返回503 pricing_unavailable，不降级报价。开关关闭仅允许不带token的标准价请求；收到旧优惠token仍按下一节返回409。

响应 Cache-Control: private, no-store；Vercel/CDN 缓存同样禁止。客户端 fetch cache=no-store，API 强制动态响应。不要把地区报价静态渲染进共享 HTML 或 sitemap。

Quote token 用 HMAC-SHA256 签名，包含：purpose=pro-price-quote、version、随机 quoteId、country、tier、currency、baseAmount、amount、priceId、policyVersion、issuedAt、expiresAt、mode。仅后端可签发；使用 timing-safe 签名比较、长度限制、严格字段校验。不得记录完整 token。

生成金额和 Coupon 映射必须来自服务端规则，不信任签名 token 之外的客户端 amount/coupon/price 字段。token 也需按当前政策重新计算检查。

报价在创建 Session 前按以下顺序验证：
1. 签名、用途、时效、Stripe mode 和 Price ID 正确。
2. 当前 policyVersion、功能开关状态与报价一致。
3. 当前请求国家与报价国家一致。
4. 服务端重新计算档位和金额完全一致。

任一价格相关条件变化返回 409 quote_expired 或 quote_changed，UI 获取新报价展示后让用户再次点击购买，禁止自动以新价格跳转。

已经成功创建的 Checkout Session 保留其价格，到 Stripe Session 自身到期为止；报价过期不取消既有 Session。实际实现保留 Stripe 默认 Session 到期时间，不传动态 expires_at：相同 quoteId 的重试必须使用完全相同的参数，否则会触发 Stripe 幂等参数冲突。上线降级可停止新报价，不应静默撤销已创建结账。

不做浏览器身份绑定的 v1 token 不是一次性凭证；接受同地区 token 的有限重放，不能用于兑换权益。quoteId 用于结账幂等，支付仍以 Stripe paid 为准。

## 8. Checkout 改动

POST /api/pro/checkout 保留 trigger、locale、returnPath，新增 quoteToken。

功能开启时缺少 quoteToken 返回 409 quote_required，由新客户端自动获取报价并请用户确认；旧标签页显示刷新提示，不能绕过报价流程。关闭时兼容既有不带 token 的 $9 请求。关闭时收到未完成的折扣 token 返回 quote_changed，避免原价替换。

创建 Session：
- mode=payment。
- line_items=[{price: config.priceId, quantity:1}]。
- currency=usd，adaptive_pricing={enabled:false}（确认 SDK 字段及实际结果）。
- customer_creation=always。
- 保留现有安全 returnPath 处理和 success/cancel URL。
- 优惠档设置 discounts=[{coupon: tier对应ID}]，完全省略 allow_promotion_codes 字段。
- 标准档不传 discounts，保留现有 allow_promotion_codes=true。用户主动输入促销码产生的进一步降价不算报价不一致；分析中单独标记。
- 不支持地区优惠与其他优惠码叠加。
- metadata 保留 product、trigger、locale，新增 pricing_policy、pricing_country、pricing_tier、pricing_quote_id、pricing_base_amount、pricing_amount；数值以字符串写入。
- 幂等 key 由 quoteId、规范化 returnPath、trigger、locale、mode 形成稳定哈希，不含 secret/邮箱；相同提交应复用同一 Session。

启用优惠时，读取并核对 Price=900 usd one_time、三个 Coupon 属性和 product 限定。可用短期服务端缓存（最长 5 分钟），不是按用户缓存。

Coupon 缺失、无效、配置错误：503 pricing_unavailable；不得悄悄改成全价，更不能传入客户端 Coupon。

Stripe 创建成功后核对 currency、amount_subtotal、total_details.amount_discount、amount_total 与预期（无税时 900/180/720、900/360/540、900/540/360）。标准档促销码是在托管页由用户输入，初始 Session 应为 900。若会话金额异常则不返回 url，记录脱敏错误并使该新建异常 Session 过期；不触碰其他订单。

错误日志只记录内部错误分类、Stripe request ID、安全错误 code、tier、policyVersion。不可把 Stripe 完整 response、请求参数或 quote token 打印出来。

## 9. UI 与国际化

弹窗状态：报价加载 → 可购买 → 创建结账 → 跳转；加载和失败时禁止带旧报价继续购买。
- 标准：$9.00，One-time payment / 一次性付款。
- 优惠：$5.40，Regional pricing applied / 已应用地区价格。
- 不称呼用户“低收入国家”，不做倒计时促销。
- 使用 Intl.NumberFormat(locale, {style:"currency", currency:"USD"})；金额取报价，不以语言决定档位。
- 英文与简体中文同步；旧 fallback 文案不得在优惠报价期间闪回 $9。
- 报价错误显示重试，恢复购买入口仍可用。
- 409 显示“价格已更新，请确认后继续”，刷新报价后等待再次点击。
- 移动端、键盘 focus、读屏标签验证；页面加载不自动弹付费墙。
- 开关关闭时按标准价工作，已买 Pro 用户不会因地区变化失去权益。

## 10. 支付验证、恢复与退款边界

同一 Price ID 仍能通过 verify 原有 line_items 检查；必须继续要求正确 product metadata 和 payment_status=paid。不要新增“amount_total 必须等于900”的检查，也不能仅凭优惠码/metadata 签发 token。

历史 $9 订单没有 pricing metadata 仍须可解锁、可恢复。四档测试付款都要覆盖 verify 和 restore；恢复成功后原有 Pro 功能应正常。

当前代码观察：
- restore 根据 email 查 complete Session，以 paid + product metadata 匹配，并非完整退款状态审计。
- validate 只验本地 Pro token 签名。
- 退款不会自动让签名 token 失效，Stripe payment_status=paid 也不能当作“从未退款”的证明。

本次不承诺新增退款撤权；若业务要求退款后即时撤权，应另行设计服务端权益状态/webhook。退款操作和真实付款由用户单次明确授权，本 spec 不能授权执行者代付或退款。

## 11. 分析指标

保留原有 duration_limit_hit、pro_upsell_viewed、pro_checkout_clicked、pro_checkout_redirected、pro_purchase_verified；新增 pro_price_quoted / pro_price_quote_failed，并给有报价的事件添加 tier、policy_version、base_amount、quoted_amount、currency、country。

pro_upsell_viewed 既有 session 去重保持不变；报价成功单独发事件，避免为附加价格而重复统计弹窗。

不上传 quoteToken、secret、邮箱或完整 Stripe Session URL。支付成功以服务端确认过的结果为准；浏览器事件用于漏斗，不能作最终收入账本。

观察 4–6 周：按地区/档位看曝光→结账→成功率、实际支付金额、退款、手续费后的净收入/访客。后台 Stripe 交易记录用于收入核对；小样本延长观察，不能据几笔订单断言收益提升。更严谨的定价因果实验不在 v1 范围。

## 12. 自动化验收矩阵

| 测试 | 期望 |
|---|---|
| US / JP / TW / SG / HK | 900、无地区 Coupon |
| PL / MY / CL | 720、20% Coupon |
| CN / BR / TR | 540、40% Coupon |
| IN / ID / VN / NG | 360、60% Coupon |
| 全白名单遍历 | 无遗漏、无国家重复归档 |
| 空值、XX、非法/多值 country | standard |
| 改语言但国家不变 | 价格不变 |
| 伪造 body country/amount/coupon | 不影响服务端价格 |
| token 篡改、过期、错误mode/price/purpose | 拒绝创建Session |
| 报价后换地区、政策更新、flag关闭 | 409并重新确认 |
| 优惠Coupon缺失/无效/错商品 | 503，无全价替代 |
| 同报价重复点击/网络重试 | 稳定幂等，不重复创建结账 |
| 返回路径恶意外链/编码绕过 | 保持现有安全行为 |
| 优惠档请求参数 | 仅discounts，不同时带allow_promotion_codes |
| 开关关闭/无新环境变量 | 既有$9、verify/restore/validate继续可用 |
| 报价响应与CDN | no-store，无跨地区缓存污染 |
| 历史订单无pricing metadata | 仍可解锁、恢复 |
| 未付款、错误商品/价格订单 | 不发Pro token |

命令门禁：pnpm run test --run、pnpm lint、pnpm exec tsc --noEmit、pnpm build；涉及发布脚本时另跑 pnpm release:test。禁止用管道末端成功掩盖测试退出码。

## 13. 集成验收与发布顺序

1. 隔离分支实现代码、测试和操作脚本；保留无关工作区内容。
2. Sandbox 核验/创建3个Coupon和测试Product/Price；只读报告记录配置。
3. 在隔离 Preview/Test 部署完成4档报价与真实 Stripe Sandbox Checkout。
4. 用测试卡完成各档付款，核对折扣金额、商品、币种、paid、返回解锁和恢复；测试取消、失败及重试。测试不会产生真实付款。
5. 本地注入国家只证明纯函数与接口逻辑；另用经授权地区测试出口验证真实 Vercel 国家判断、缓存隔离和伪造header处理。证据不足时标明，不能把mock写成生产证明。
6. 验收当前精确提交，检查 Product/Price 未变、无secret入仓、旧订单兼容、无跨地区报价缓存。
7. 用户授权 live 配置后，在指定账户创建/复用3个限定Coupon，配置生产变量，读回验证。此时flag仍false。
8. 用户授权合并/发布后，先发布flag=false版本，验证现有购买链路正常；再配置flag=true并重新部署。每次上线动作遵守届时授权。
9. 使用干净同步main运行 pnpm release:solo，记录部署ID、SHA、Production Ready和域名指向。PR #15 的build-only/复用证据不能代替本次生产发布结果。
10. 生产只看Checkout页面核对金额，不提交真实支付；真实付款/退款由用户完成或另行单次明确授权。
11. 交付变更文件、Stripe对象ID、部署SHA、测试摘要、回滚步骤和仍未验证的项目。

## 14. 回滚

正常关闭：PRO_REGIONAL_PRICING_ENABLED=false → 发布新部署 → 验证新报价回到900、旧优惠token返回409、历史Pro权益正常。更改环境变量本身不构成完成。

紧急回滚：恢复已验证的上一生产部署，记录其SHA及配置兼容性，禁止盲推源码。不要删除Coupon、Price、Product或付款历史；已创建的正常优惠Checkout允许按原金额完成。若确认优惠被滥用而需要批量过期Session，必须单独明确范围并授权。

回滚完成要求：首页可用，standard Checkout可创建，verify/restore可用，没有silent fallback和账号级变更。

## 15. 交付清单与完成定义

- [ ] 国家表、金额、版本和off比例无歧义。
- [ ] 一个live Product、一个live Price保持原样，三Coupon全部限于该Product。
- [ ] Sandbox/Preview/Production凭据和对象隔离，环境差异有记录。
- [ ] 报价与结账共享服务端策略，签名/过期/409/幂等路径通过。
- [ ] 四档正常支付、旧订单、失败场景通过。
- [ ] 真正线上国家识别和缓存行为有证据或明确未验证。
- [ ] Live写入和发布分别有用户授权，未把写spec当作授权。
- [ ] 上线及回滚观测可复现，无秘密落入报告。
- [ ] 未把退款撤权、VPN防护、收入提升或生产端到端付款声称为已证明。

## 16. 官方资料

以下资料用于核对接口能力；执行时以实际SDK类型和API响应再次验证。
- Stripe Coupons API（百分比优惠、商品限定、创建与字段）：https://docs.stripe.com/api/coupons/create
- Stripe Checkout discounts：https://docs.stripe.com/payments/checkout/discounts
- Stripe Checkout create：https://docs.stripe.com/api/checkout/sessions/create
- Stripe Adaptive Pricing（本币换汇，非国家购买力折扣）：https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing?payment-ui=stripe-hosted
- Vercel request headers（IP country）：https://vercel.com/docs/headers/request-headers
- Stripe products/prices：https://docs.stripe.com/products-prices/how-products-and-prices-work


## 17. 实现与证据记录（2026-10-15）

实现分支 feat/pro-regional-pricing；地区开关默认关闭。

代码测试包含服务端 Stripe mock、HMAC边界、真实DOM弹窗交互、旧订单/折扣订单解锁恢复、配置脚本只读/幂等/超时恢复；不能把这些写成Stripe Sandbox实际付款证明。

已完成一次live只读预检：目标账户、Product、USD900 Price匹配；三个固定Coupon ID均待创建。未创建Stripe对象、未改Vercel环境、未合并发布。本次仍待：Sandbox真实Checkout、平台地理header可信性集成验证、live配置和上线观测。

操作命令、授权边界与验收记录见 docs/deploy/pro-regional-pricing.md。
