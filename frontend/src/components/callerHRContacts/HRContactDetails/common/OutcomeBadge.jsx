const OutcomeBadge = ({ outcome }) => {
  const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full';
  const styles = {
    connected: 'bg-green-100 text-green-800',
    follow_up: 'bg-yellow-100 text-yellow-800',
    not_connected: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`${baseClasses} ${styles[outcome?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}
    >
      {outcome}
    </span>
  );
};

export default OutcomeBadge;
