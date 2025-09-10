const StatusBadge = ({ text, type }) => {
  const styles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    default: 'bg-slate-100 text-slate-800',
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[type] || styles.default}`}
    >
      {text}
    </span>
  );
};

export default StatusBadge;
