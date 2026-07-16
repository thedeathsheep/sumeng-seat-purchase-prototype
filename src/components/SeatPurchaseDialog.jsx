import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleHelp,
  CreditCard,
  LoaderCircle,
  Minus,
  Plus,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

import { calculateSeatPurchase } from "../domain/billing.js";

const CYCLE = {
  start: "2026-07-01",
  end: "2026-07-31",
  remainingDays: 17,
  cycleDays: 31,
};

const money = (value) => value.toFixed(2);
const credits = (value) => value.toFixed(2);

export function SeatPurchaseDialog({ open, plan, currentSeats, onClose, onComplete }) {
  const [addedSeats, setAddedSeats] = useState(1);
  const [status, setStatus] = useState("form");
  const [paymentMethod, setPaymentMethod] = useState("wechat");
  const [completedPurchase, setCompletedPurchase] = useState(null);

  useEffect(() => {
    if (open) {
      setAddedSeats(1);
      setStatus("form");
      setPaymentMethod("wechat");
      setCompletedPurchase(null);
    }
  }, [open]);

  const result = useMemo(
    () => calculateSeatPurchase({
      unitPrice: plan.monthly,
      unitCredits: plan.credits,
      currentSeats,
      addedSeats,
      remainingDays: CYCLE.remainingDays,
      cycleDays: CYCLE.cycleDays,
    }),
    [addedSeats, currentSeats, plan],
  );

  if (!open) return null;

  const confirmPayment = () => {
    setStatus("processing");
    window.setTimeout(() => {
      const purchaseSnapshot = {
        addedSeats,
        newSeatCount: result.newSeatCount,
        grantedCredits: result.grantedCredits,
        renewalAmount: result.renewalAmount,
      };
      setCompletedPurchase(purchaseSnapshot);
      onComplete(purchaseSnapshot);
      setStatus("success");
    }, 550);
  };

  const successResult = completedPurchase ?? {
    addedSeats,
    newSeatCount: result.newSeatCount,
    grantedCredits: result.grantedCredits,
    renewalAmount: result.renewalAmount,
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && status === "form") onClose();
    }}>
      <section className="seat-dialog" role="dialog" aria-modal="true" aria-labelledby="seat-dialog-title">
        <button className="icon-button seat-dialog__close" type="button" onClick={onClose} aria-label="关闭">
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="success-state">
            <div className="success-state__icon"><CheckCircle2 size={36} /></div>
            <p className="eyebrow">支付成功</p>
            <h2 id="seat-dialog-title">新增席位已生效</h2>
            <p className="success-state__lead">团队现在共有 <strong>{successResult.newSeatCount}</strong> 个席位，积分已发放到团队积分池。</p>
            <div className="success-metrics">
              <div><span>新增席位</span><strong>+{successResult.addedSeats}</strong></div>
              <div><span>到账积分</span><strong>+{credits(successResult.grantedCredits)}</strong></div>
            </div>
            <div className="success-renewal">
              <CalendarDays size={18} />
              <div><span>本周期至 {CYCLE.end}</span><strong>下次续费 ¥{successResult.renewalAmount}/月</strong></div>
            </div>
            <button className="button button--primary button--wide" type="button" onClick={onClose}>完成</button>
          </div>
        ) : (
          <>
            <header className="seat-dialog__header">
              <p className="eyebrow">当前套餐：{plan.name}</p>
              <h2 id="seat-dialog-title">加购团队席位</h2>
            </header>

            <div className="cycle-strip cycle-strip--compact">
              <CalendarDays size={18} />
              <span>本周期至 <strong>{CYCLE.end}</strong>，剩余 <strong>{CYCLE.remainingDays}/{CYCLE.cycleDays}</strong> 天</span>
            </div>

            <div className="seat-selector seat-selector--compact" aria-label="席位变化">
              <div className="seat-selector__change">
                <span>新增席位</span>
                <strong>{currentSeats} 席 <ArrowRight size={15} /> {result.newSeatCount} 席</strong>
              </div>
              <div className="stepper" aria-label="新增席位数">
                <button type="button" onClick={() => setAddedSeats((value) => Math.max(1, value - 1))} disabled={addedSeats === 1} aria-label="减少新增席位"><Minus size={17} /></button>
                <output>{addedSeats}</output>
                <button type="button" onClick={() => setAddedSeats((value) => value + 1)} aria-label="增加新增席位"><Plus size={17} /></button>
              </div>
            </div>

            <section className="billing-summary" aria-label="费用明细">
              <div className="billing-summary__heading">
                <strong>费用明细</strong>
                <span className="rounding-help" title="应付金额向下保留 2 位小数；到账积分向上保留 2 位小数">
                  <CircleHelp size={15} />
                </span>
              </div>
              <div className="billing-summary__formula">
                <span>¥{plan.monthly}.00 × {addedSeats} 席 × {CYCLE.remainingDays}/{CYCLE.cycleDays}</span>
                <strong>¥{money(result.payableAmount)}</strong>
              </div>
              <div className="billing-summary__credits">
                <Zap size={15} fill="currentColor" />
                <span>支付后到账</span>
                <strong>{credits(result.grantedCredits)} 积分</strong>
              </div>
            </section>

            <fieldset className="payment-methods">
              <legend>支付方式</legend>
              <button type="button" className={paymentMethod === "wechat" ? "is-selected" : ""} onClick={() => setPaymentMethod("wechat")}>
                <WalletCards size={18} />微信支付{paymentMethod === "wechat" && <Check size={15} />}
              </button>
              <button type="button" className={paymentMethod === "alipay" ? "is-selected" : ""} onClick={() => setPaymentMethod("alipay")}>
                <CreditCard size={18} />支付宝{paymentMethod === "alipay" && <Check size={15} />}
              </button>
            </fieldset>

            <div className="renewal-line">
              <span>下期按 {result.newSeatCount} 席续费</span>
              <strong>¥{result.renewalAmount}/月</strong>
            </div>

            <footer className="seat-dialog__footer">
              <button className="button button--secondary" type="button" onClick={onClose} disabled={status === "processing"}>取消</button>
              <button className="button button--primary" type="button" onClick={confirmPayment} disabled={status === "processing"}>
                {status === "processing" ? <><LoaderCircle className="spin" size={18} />处理中</> : `确认支付 ¥${money(result.payableAmount)}`}
              </button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
