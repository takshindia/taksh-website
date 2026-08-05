export default function Skeleton({ height = 16, width = '100%', className = '' }: { height?: number | string; width?: string; className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#111] rounded ${className}`}
      style={{ height, width }}
    />
  );
}
