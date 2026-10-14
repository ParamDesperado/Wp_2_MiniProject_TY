import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

// "Show logic" button. Opens the step-by-step working that comes from server/logic.js.
// Pass either `steps` (one list) or `sections` ([{ title, steps }]).
const LogicBox = ({ steps, sections, label = 'Show logic' }) => {
  const [open, setOpen] = useState(false);
  const groups = (sections || [{ steps }]).filter(g => g.steps && g.steps.length);
  if (groups.length === 0) return null;
  return (
    <div className="logic-box">
      <button type="button" className="logic-toggle" onClick={() => setOpen(!open)}>
        <Calculator size={14} /> {open ? 'Hide logic' : label}
      </button>
      {open && (
        <div className="logic-steps">
          {groups.map((g, i) => (
            <div key={i}>
              {g.title && <div className="logic-title">{g.title}</div>}
              <ol>{g.steps.map((s, j) => <li key={j}>{s}</li>)}</ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogicBox;
