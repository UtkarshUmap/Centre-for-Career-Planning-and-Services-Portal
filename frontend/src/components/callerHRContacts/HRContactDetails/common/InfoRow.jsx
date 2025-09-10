const InfoRow = ({ icon, text, href }) => (
  <div className="flex items-start">
    {icon}
    {href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
        {text}
      </a>
    ) : (
      <span className="text-slate-700 break-all">{text}</span>
    )}
  </div>
);

export default InfoRow;
