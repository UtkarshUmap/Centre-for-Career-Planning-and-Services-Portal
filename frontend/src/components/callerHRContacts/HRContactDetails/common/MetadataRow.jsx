const MetadataRow = ({ label, children }) => (
  <p>
    <strong className="font-medium text-slate-500 w-24 inline-block">{label}:</strong>{' '}
    {children}
  </p>
);

export default MetadataRow;
