import { useState, useEffect } from 'react';

function DaysChip({ deliveryDate }) {
  if (!deliveryDate) return <span style={{ color: 'var(--text3)' }}>—</span>;
  const days = Math.ceil((new Date(deliveryDate) - new Date()) / 86400000);
  const color = days < 0 ? 'var(--red)' : days < 7 ? 'var(--red)' : days < 14 ? 'var(--accent)' : 'var(--green)';
  const label = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'today' : `${days}d left`;
  return <span style={{ color, fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{label}</span>;
}

// ── Order-level stats (when an order is selected) ──────────────────────────
function OrderStats({ steps, currentFilter, selectedOrder }) {
  const filtered = currentFilter === 'all' ? steps : steps.filter((s) => s.dept === currentFilter);
  const ip      = filtered.filter((s) => s.status === 'inprogress').length;
  const blocked = filtered.filter((s) => s.status === 'blocked').length;
  const done    = filtered.filter((s) => s.status === 'done').length;
  const total   = filtered.length;

  let orderStatus = 'PENDING';
  let statusColor = 'var(--accent)';
  if (total === 0)         { orderStatus = 'NO TASKS';    statusColor = 'var(--text3)'; }
  else if (done === total) { orderStatus = 'COMPLETE';    statusColor = 'var(--green)'; }
  else if (blocked > 0)   { orderStatus = 'BLOCKED';     statusColor = 'var(--red)';   }
  else if (done > 0 || ip > 0) { orderStatus = 'IN PROGRESS'; statusColor = 'var(--blue)'; }

  return (
    <div className="stats-row">
      <div className="stat-card stat-status">
        <div className="stat-label">Order Status</div>
        <div className="stat-value" style={{ color: statusColor, fontSize: 13, fontWeight: 700, marginTop: 4 }}>{orderStatus}</div>
        <div className="stat-sub">{selectedOrder?.order_number || 'no order selected'}</div>
      </div>

      <div className="stat-card stat-progress">
        <div className="stat-label">In Progress</div>
        <div className="stat-value" style={{ color: ip > 0 ? 'var(--blue)' : 'var(--text3)' }}>{ip}</div>
        <div className="stat-sub">active steps</div>
      </div>

      <div className="stat-card stat-blocked">
        <div className="stat-label">Blocked</div>
        <div className="stat-value" style={{ color: blocked > 0 ? 'var(--red)' : 'var(--text3)' }}>{blocked}</div>
        <div className="stat-sub">{blocked > 0 ? 'need attention' : 'all clear'}</div>
      </div>

      <div className="stat-card stat-delivery">
        <div className="stat-label">Delivery</div>
        <div style={{ marginTop: 4 }}><DaysChip deliveryDate={selectedOrder?.delivery_date} /></div>
        <div className="stat-sub">
          {selectedOrder?.delivery_date ? new Date(selectedOrder.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'}
        </div>
      </div>
    </div>
  );
}

// ── Aggregate stats (no order selected) ───────────────────────────────────
function AggregateStats() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(window.API_BASE + "/api/board", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((orders) => {
        const today = new Date();
        const in7   = new Date(today); in7.setDate(today.getDate() + 7);
        let totalBlocked = 0, totalIP = 0, urgentHigh = 0, dueThisWeek = 0;

        orders.forEach((o) => {
          const p = (o.priority || 'Medium').toLowerCase();
          if (p === 'urgent' || p === 'high') urgentHigh++;
          if (o.delivery_date) {
            const d = new Date(o.delivery_date);
            if (d >= today && d <= in7) dueThisWeek++;
          }
          (o.steps || []).forEach((s) => {
            if (s.status === 'blocked')    totalBlocked++;
            if (s.status === 'inprogress') totalIP++;
          });
        });

        setData({ total: orders.length, urgentHigh, totalBlocked, totalIP, dueThisWeek });
      })
      .catch(() => setData(null));
  }, [token]);

  if (!data) {
    return (
      <div className="stats-row">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="stat-card" style={{ opacity: 0.4 }}>
            <div className="stat-label">Loading…</div>
            <div className="stat-value">—</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-row">
      <div className="stat-card stat-active">
        <div className="stat-label">Active Orders</div>
        <div className="stat-value" style={{ color: 'var(--text)' }}>{data.total}</div>
        <div className="stat-sub">in pipeline</div>
      </div>

      <div className="stat-card stat-urgent">
        <div className="stat-label">Urgent / High</div>
        <div className="stat-value" style={{ color: data.urgentHigh > 0 ? 'var(--accent)' : 'var(--text3)' }}>{data.urgentHigh}</div>
        <div className="stat-sub">priority orders</div>
      </div>

      <div className="stat-card stat-progress">
        <div className="stat-label">In Progress</div>
        <div className="stat-value" style={{ color: data.totalIP > 0 ? 'var(--blue)' : 'var(--text3)' }}>{data.totalIP}</div>
        <div className="stat-sub">steps across orders</div>
      </div>

      <div className="stat-card stat-blocked">
        <div className="stat-label">Blocked</div>
        <div className="stat-value" style={{ color: data.totalBlocked > 0 ? 'var(--red)' : 'var(--text3)' }}>{data.totalBlocked}</div>
        <div className="stat-sub">{data.totalBlocked > 0 ? 'need attention' : 'all clear'}</div>
      </div>

      <div className="stat-card stat-due">
        <div className="stat-label">Due This Week</div>
        <div className="stat-value" style={{ color: data.dueThisWeek > 0 ? 'var(--accent)' : 'var(--text3)' }}>{data.dueThisWeek}</div>
        <div className="stat-sub">orders</div>
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
export default function StatsRow({ steps, currentFilter, selectedOrder }) {
  if (selectedOrder) {
    return <OrderStats steps={steps} currentFilter={currentFilter} selectedOrder={selectedOrder} />;
  }
  return <AggregateStats />;
}
