import { Check, Zap } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("zh-CN");

export function PlanCard({ plan, billingCycle, seatCount, isCurrent, selected, onSelect }) {
  const unitPrice = billingCycle === "annual" ? plan.annual : plan.monthly;
  const totalPrice = unitPrice * seatCount;
  const annualDiscount = plan.annual
    ? Math.round((1 - plan.annual / (plan.monthly * 12)) * 100)
    : 0;

  return (
    <article className={`plan-card ${isCurrent ? "plan-card--current" : ""} ${selected ? "plan-card--selected" : ""}`}>
      {plan.popular && <div className="plan-card__ribbon">热门</div>}
      <div className="plan-card__header">
        <div>
          <h2>{plan.name}</h2>
          <p className="plan-card__price">
            <span>¥</span>{numberFormatter.format(totalPrice)}
            <small>/{billingCycle === "annual" ? "年" : "月"}</small>
          </p>
          <p className="plan-card__unit">
            {numberFormatter.format(unitPrice)}元/{billingCycle === "annual" ? "年" : "月"}/席位
            {billingCycle === "annual" && annualDiscount > 0 && <em>省{annualDiscount}%</em>}
          </p>
        </div>
      </div>

      <div className="plan-card__credits">
        <Zap size={18} fill="currentColor" />
        <strong>{numberFormatter.format(plan.credits)} 积分/月/席位</strong>
      </div>
      <p className="plan-card__estimate">按当前 {seatCount} 席配置，积分进入团队积分池</p>

      <button
        className={isCurrent ? "button button--muted" : "button button--primary"}
        type="button"
        disabled={isCurrent}
        onClick={() => onSelect(plan.id)}
      >
        {isCurrent ? "当前套餐" : selected ? "已选择" : "立即升级"}
      </button>

      <div className="plan-card__divider" />
      <h3>基础权益</h3>
      <ul className="benefit-list">
        <li><Check size={15} />项目创建上限：{plan.projects}</li>
        <li><Check size={15} />并发任务上限：{plan.concurrency}</li>
        <li><Check size={15} />云空间：{plan.storage}</li>
        <li><Check size={15} />商业授权：商用无忧</li>
        <li><Check size={15} />支持服务：{plan.support}</li>
      </ul>
    </article>
  );
}
