import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Menu,
  Plus,
  ShoppingBag,
  UsersRound,
  X,
  Zap,
} from "lucide-react";

import { PlanCard } from "./components/PlanCard.jsx";
import { SeatPurchaseDialog } from "./components/SeatPurchaseDialog.jsx";
import { Brand, Sidebar } from "./components/Sidebar.jsx";
import { plans } from "./data/plans.js";

const currentPlan = plans[0];

export function App() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [seatCount, setSeatCount] = useState(2);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scenario, setScenario] = useState("normal");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [creditNotice, setCreditNotice] = useState(null);

  const visiblePlans = useMemo(
    () => plans.filter((plan) => billingCycle === "monthly" || plan.annual),
    [billingCycle],
  );
  const actualMembers = scenario === "overlimit" ? seatCount + 2 : seatCount;

  const completePurchase = ({ newSeatCount, grantedCredits }) => {
    setSeatCount(newSeatCount);
    setCreditNotice(`+${grantedCredits.toFixed(2)} 积分已到账`);
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="mobile-topbar">
        <Brand compact />
        <button className="icon-button" type="button" aria-label="打开导航"><Menu size={21} /></button>
      </div>

      <main className="main-content">
        <div className="page-topline">
          <button className="back-button" type="button"><ArrowLeft size={18} />团队管理</button>
          <div className="review-switch" aria-label="评审场景">
            <span>场景</span>
            <button type="button" className={scenario === "normal" ? "is-active" : ""} onClick={() => setScenario("normal")}>正常</button>
            <button type="button" className={scenario === "overlimit" ? "is-active" : ""} onClick={() => setScenario("overlimit")}>降级超席</button>
          </div>
        </div>

        <header className="page-header">
          <div>
            <h1>升级团队套餐</h1>
            <p>团队管理 / 概览 / 升级团队套餐</p>
          </div>
        </header>

        <section className="cloud-overview" aria-label="当前云空间概览">
          <div className="cloud-overview__title">
            <div><Cloud size={18} /><strong>当前云空间概览</strong></div>
            <span><CheckCircle2 size={13} />组织共享池</span>
          </div>
          <div className="cloud-overview__stats">
            <div><span>总容量</span><strong>1 GB</strong></div>
            <div><span>已使用</span><strong>0.26 GB</strong><i><b style={{ width: "26%" }} /></i></div>
            <div><span>剩余</span><strong>0.74 GB</strong></div>
          </div>
        </section>

        <section className="expansion-choice" aria-label="选择扩容方式">
          <h2>选择扩容方式</h2>
          <p>优先推荐升级套餐（立即生效、可叠加）；如团队整体权益不足，可选择加购容量包。</p>
          <div>
            <button className="button button--primary" type="button">升级团队套餐</button>
            <button className="button button--secondary" type="button">加购容量包</button>
          </div>
        </section>

        <div className="policy-note">升级立即生效；降级在当前账期结束后生效，降级前请确认成员数与项目数不超出目标套餐上限。</div>

        {scenario === "overlimit" && (
          <div className="overlimit-alert" role="status">
            <AlertTriangle size={20} />
            <div>
              <strong>当前成员数超过已购席位</strong>
              <p>当前 {actualMembers} 名成员，已购 {seatCount} 席。已有成员可继续使用，暂不可邀请新成员或接受待处理邀请。</p>
            </div>
            <button className="button button--secondary" type="button">管理成员<ChevronRight size={16} /></button>
          </div>
        )}

        <section className="plan-controls" aria-label="套餐配置">
          <div className="billing-row">
            <div className="billing-tabs" role="tablist" aria-label="计费周期">
              <button type="button" role="tab" aria-selected={billingCycle === "monthly"} className={billingCycle === "monthly" ? "is-active" : ""} onClick={() => setBillingCycle("monthly")}>月付</button>
              <button type="button" role="tab" aria-selected={billingCycle === "annual"} className={billingCycle === "annual" ? "is-active" : ""} onClick={() => setBillingCycle("annual")}>年付<span>9折</span></button>
            </div>
            <button className="button button--secondary purchase-credit" type="button" aria-label="购买积分" title="购买积分"><ShoppingBag size={18} />购买积分</button>
          </div>

          <div className="seat-control">
            <UsersRound size={18} />
            <span>团队席位</span>
            <strong>{seatCount}</strong>
            <em>最低 2 席</em>
            <button className="button button--seat" type="button" onClick={() => setDialogOpen(true)}><Plus size={16} />加购席位</button>
          </div>
        </section>

        <section className="plans-viewport" aria-label="团队套餐列表">
          <div className="plans-grid">
            {visiblePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                seatCount={seatCount}
                isCurrent={plan.id === currentPlan.id && billingCycle === "monthly"}
                selected={selectedPlan === plan.id}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>
        </section>
      </main>

      {creditNotice && (
        <div className="toast" role="status"><Zap size={17} fill="currentColor" />{creditNotice}<button type="button" onClick={() => setCreditNotice(null)} aria-label="关闭提示"><X size={15} /></button></div>
      )}

      <SeatPurchaseDialog
        open={dialogOpen}
        plan={currentPlan}
        currentSeats={seatCount}
        onClose={() => setDialogOpen(false)}
        onComplete={completePurchase}
      />
    </div>
  );
}
