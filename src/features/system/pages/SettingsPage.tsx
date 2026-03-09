import { useQuery } from '@tanstack/react-query';
import { getSystemSettings } from '@/api/endpoints';
import type { SystemSetting } from '@/api/types';

export default function SettingsPage(): React.ReactElement {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['system-settings'],
    queryFn: () => getSystemSettings(),
  });

  const settings = data?.success ? data.data : null;

  const grouped = settings
    ? settings.reduce<Record<string, SystemSetting[]>>((acc, s) => {
        const group = s.group ?? 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(s);
        return acc;
      }, {})
    : null;

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">System configuration</p>
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading settings...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load settings. Please try again.
        </div>
      )}

      {grouped && Object.entries(grouped).map(([group, items]) => (
        <section key={group}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{group}</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {items.map((s: SystemSetting) => (
              <div key={s.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 font-mono">{s.key}</p>
                </div>
                <div className="text-sm text-gray-500 font-mono max-w-sm text-right truncate">
                  {typeof s.value === 'object'
                    ? JSON.stringify(s.value)
                    : String(s.value)}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
