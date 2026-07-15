import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
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
              <p>新增席位支付成功后立即生效，本次仅补当前周期剩余费用。</p>
            </header>

            <div className="cycle-strip">
              <CalendarDays size={18} />
              <div>
                <span>当前计费周期</span>
                <strong>{CYCLE.start} 至 {CYCLE.end}</strong>
              </div>
              <em>剩余 {CYCLE.remainingDays}/{CYCLE.cycleDays} 天</em>
            </div>

            <div className="seat-selector">
              <div>
                <span>新增席位</span>
                <small>仅支持增加，当前周期内不可减少</small>
              </div>
              <div className="stepper" aria-label="新增席位数">
                <button type="button" onClick={() => setAddedSeats((value) => Math.max(1, value - 1))} disabled={addedSeats === 1} aria-label="减少新增席位"><Minus size={17} /></button>
                <output>{addedSeats}</output>
                <button type="button" onClick={() => setAddedSeats((value) => value + 1)} aria-label="增加新增席位"><Plus size={17} /></button>
              </div>
            </div>

            <div className="seat-change" aria-label="席位变化">
              <div><span>当前席位</span><strong>{currentSeats} 席</strong></div>
              <div className="seat-change__arrow">→</div>
              <div><span>购买后席位</span><strong>{result.newSeatCount} 席</strong></div>
            </div>

            <div className="calculation-list">
              <div><span>每席月价</span><strong>¥{plan.monthly}.00</strong></div>
              <div><span>剩余周期比例</span><strong>{CYCLE.remainingDays} ÷ {CYCLE.cycleDays}</strong></div>
              <div><span>下次续费</span><strong>¥{result.renewalAmount}/月</strong></div>
            </div>

            <div className="charge-summary">
              <div>
                <span>本次应付</span>
                <strong>¥{money(result.payableAmount)}</strong>
                <small>金额向下保留 2 位小数</small>
              </div>
              <div>
                <span><Zap size={15} fill="currentColor" />预计到账积分</span>
                <strong>{credits(result.grantedCredits)}</strong>
                <small>积分向上保留 2 位小数</small>
              </div>
            </div>

            <fieldset className="payment-methods">
              <legend>支付方式</legend>
              <button type="button" className={paymentMethod === "wechat" ? "is-selected" : ""} onClick={() => setPaymentMethod("wechat")}>
                <WalletCards size={18} />微信支付{paymentMethod === "wechat" && <Check size={15} />}
              </button>
              <button type="button" className={paymentMethod === "alipay" ? "is-selected" : ""} onClick={() => setPaymentMethod("alipay")}>
                <CreditCard size={18} />支付宝{paymentMethod === "alipay" && <Check size={15} />}
              </button>
            </fieldset>

            <p className="seat-dialog__note">新增席位会并入当前订阅，下次续费按新的总席位数计算。</p>

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
