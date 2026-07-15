import {
  ChevronDown,
  FolderClosed,
  Grid2X2,
  Infinity,
  MessageSquare,
  Plus,
  UsersRound,
} from "lucide-react";

export function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand--compact" : ""}`}>
      <img src={`${import.meta.env.BASE_URL}sumeng-logo.svg`} alt="塑梦AI" />
      <span>塑梦AI</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="主导航">
      <div className="sidebar__top">
        <Brand />
        <button className="icon-button sidebar__collapse" type="button" aria-label="收起侧栏">
          <span className="collapse-mark" aria-hidden="true" />
        </button>
      </div>

      <div className="sidebar__actions">
        <button className="sidebar-action" type="button"><Plus size={18} />开始创作</button>
        <button className="sidebar-action" type="button"><Infinity size={18} />无限画布</button>
      </div>

      <nav className="sidebar__nav">
        <button type="button" className="nav-row nav-row--active"><Grid2X2 size={17} />资产库</button>
        <button type="button" className="nav-row"><FolderClosed size={17} />我的项目<ChevronDown size={14} /></button>
        <div className="nav-placeholder" />
        <button type="button" className="nav-row"><MessageSquare size={17} />最近会话<ChevronDown size={14} /></button>
        <p className="empty-copy">暂无会话</p>
      </nav>

      <div className="sidebar__account">
        <div className="account-avatar"><UsersRound size={18} /></div>
        <div>
          <strong>大魔术师（正式版）</strong>
          <span>终极大导演</span>
        </div>
        <ChevronDown size={15} />
      </div>
    </aside>
  );
}
