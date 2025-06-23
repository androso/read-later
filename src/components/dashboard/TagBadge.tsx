interface TagBadgeProps {
  tag: {
    _id: string;
    name: string;
    color?: string;
  };
}

export default function TagBadge({ tag }: TagBadgeProps) {
  const defaultColors: Record<string, string> = {
    'react': 'bg-blue-100 text-blue-800',
    'typescript': 'bg-blue-100 text-blue-800',
    'javascript': 'bg-yellow-100 text-yellow-800',
    'ai': 'bg-purple-100 text-purple-800',
    'machine learning': 'bg-purple-100 text-purple-800',
    'design': 'bg-green-100 text-green-800',
    'ux': 'bg-green-100 text-green-800',
    'productivity': 'bg-pink-100 text-pink-800',
    'kubernetes': 'bg-cyan-100 text-cyan-800',
    'devops': 'bg-cyan-100 text-cyan-800',
    'performance': 'bg-orange-100 text-orange-800',
    'security': 'bg-red-100 text-red-800',
    'startup': 'bg-indigo-100 text-indigo-800',
  };

  const colorClass = tag.color || defaultColors[tag.name.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {tag.name}
    </span>
  );
} 