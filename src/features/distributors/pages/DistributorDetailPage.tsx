import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDistributor,
  getNetworkResellers,
  assignDistributorCity,
  unassignDistributorCity,
  approveDistributor,
  rejectDistributor,
  suspendDistributor,
  unsuspendDistributor,
} from '@/api/endpoints';
import type { Distributor, DistributorRank, NetworkReseller } from '@/api/types';

const RANK_COLORS: Record<DistributorRank, string> = {
  STARTER: 'bg-gray-100 text-gray-600',
  BRONZE: 'bg-orange-100 text-orange-700',
  SILVER: 'bg-slate-100 text-slate-600',
  GOLD: 'bg-yellow-100 text-yellow-700',
  PLATINUM: 'bg-cyan-100 text-cyan-700',
  DIAMOND: 'bg-indigo-100 text-indigo-700',
};

function getDistributorStatus(d: Distributor): 'pending' | 'approved' | 'rejected' | 'suspended' {
  if (d.suspended_at) return 'suspended';
  if (d.rejected_at) return 'rejected';
  if (d.approved_at) return 'approved';
  return 'pending';
}

function resellerLinkType(r: NetworkReseller, assignedCity: string | null): 'direct' | 'city' | 'both' {
  const byInvite = r.parent_distributor_id !== null;
  const byCity = assignedCity !== null && r.city === assignedCity;
  if (byInvite && byCity) return 'both';
  if (byInvite) return 'direct';
  return 'city';
}

export default function DistributorDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const distributorId = Number(id);

  const [cityInput, setCityInput] = useState('');
  const [showCityForm, setShowCityForm] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [activeAction, setActiveAction] = useState<'reject' | 'suspend' | null>(null);

  const { data: distData, isLoading, isError } = useQuery({
    queryKey: ['distributor', distributorId],
    queryFn: () => getDistributor(distributorId),
    enabled: !isNaN(distributorId),
  });

  const { data: networkData } = useQuery({
    queryKey: ['network-resellers', distributorId],
    queryFn: () => getNetworkResellers(distributorId),
    enabled: !isNaN(distributorId),
  });

  const invalidate = (): void => {
    void qc.invalidateQueries({ queryKey: ['distributor', distributorId] });
    void qc.invalidateQueries({ queryKey: ['network-resellers', distributorId] });
    void qc.invalidateQueries({ queryKey: ['distributors'] });
  };

  const assignCity = useMutation({
    mutationFn: (city: string) => assignDistributorCity(distributorId, city),
    onSuccess: () => { invalidate(); setShowCityForm(false); setCityInput(''); },
  });

  const unassignCity = useMutation({
    mutationFn: () => unassignDistributorCity(distributorId),
    onSuccess: invalidate,
  });

  const approve = useMutation({
    mutationFn: () => approveDistributor(distributorId),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: () => rejectDistributor(distributorId, reasonInput || undefined),
    onSuccess: () => { invalidate(); setActiveAction(null); setReasonInput(''); },
  });

  const suspend = useMutation({
    mutationFn: () => suspendDistributor(distributorId, reasonInput || undefined),
    onSuccess: () => { invalidate(); setActiveAction(null); setReasonInput(''); },
  });

  const unsuspend = useMutation({
    mutationFn: () => unsuspendDistributor(distributorId),
    onSuccess: invalidate,
  });

  const dist = distData?.success ? distData.data : null;
  const network = networkData?.success ? networkData.data : null;
  const status = dist ? getDistributorStatus(dist) : null;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading distributor...
        </div>
      </div>
    );
  }

  if (isError || !dist) {
    return (
      <div className="p-6 space-y-4">
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Distributor not found or failed to load.
        </div>
        <button type="button" onClick={() => navigate('/distributors')}
          className="text-sm text-indigo-600 hover:underline">
          Back to Distributors
        </button>
      </div>
    );
  }

  const assignCityError = assignCity.error instanceof Error ? assignCity.error.message : null;

  return (
    <div className="p-6 space-y-6" style={{ scrollbarGutter: 'stable' }}>

      {/* Back + Header */}
      <header className="space-y-1">
        <nav>
          <Link to="/distributors" className="text-xs text-indigo-600 hover:underline">
            &larr; Back to Distributors
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900 font-mono">{dist.distributor_code}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RANK_COLORS[dist.rank]}`}>
            {dist.rank}
          </span>
          {status === 'suspended' && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">Suspended</span>
          )}
          {status === 'rejected' && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">Rejected</span>
          )}
          {status === 'pending' && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">Pending Approval</span>
          )}
          {status === 'approved' && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">Approved</span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column: info + actions */}
        <div className="lg:col-span-1 space-y-5">

          {/* Info card */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Profile</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Referral Code</dt>
                <dd className="font-mono text-gray-800">{dist.referral_code ?? '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Personal Sales</dt>
                <dd className="font-mono text-gray-800">
                  ₱{parseFloat(dist.total_personal_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Network Sales</dt>
                <dd className="font-mono text-gray-800">
                  ₱{parseFloat(dist.total_network_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Joined</dt>
                <dd className="text-gray-700">{new Date(dist.created_at).toLocaleDateString()}</dd>
              </div>
              {dist.approved_at && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Approved</dt>
                  <dd className="text-gray-700">{new Date(dist.approved_at).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* City Assignment */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">City Assignment</h2>
            <p className="text-xs text-gray-500">
              One distributor per city. Resellers in the assigned city automatically join this distributor's network.
            </p>

            {dist.assigned_city ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2">
                  <span className="text-sm font-medium text-indigo-800">{dist.assigned_city}</span>
                  <button
                    type="button"
                    onClick={() => unassignCity.mutate()}
                    disabled={unassignCity.isPending}
                    className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {unassignCity.isPending ? 'Removing…' : 'Remove'}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Removing the city assignment will revert city-based resellers to direct ordering.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-amber-600 font-medium">No city assigned — this distributor has no city territory.</p>
                {!showCityForm ? (
                  <button
                    type="button"
                    onClick={() => setShowCityForm(true)}
                    className="w-full rounded-lg border border-dashed border-indigo-300 py-2 text-xs text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50"
                  >
                    + Assign City
                  </button>
                ) : (
                  <form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      if (cityInput.trim()) assignCity.mutate(cityInput.trim());
                    }}
                    className="space-y-2"
                  >
                    <label htmlFor="city-input" className="sr-only">City name</label>
                    <input
                      id="city-input"
                      type="text"
                      value={cityInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCityInput(e.target.value)}
                      placeholder="e.g. Makati"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                    />
                    {assignCityError && (
                      <p className="text-xs text-red-600">{assignCityError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={assignCity.isPending || !cityInput.trim()}
                        className="flex-1 rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {assignCity.isPending ? 'Assigning…' : 'Assign'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowCityForm(false); setCityInput(''); }}
                        className="flex-1 rounded-lg border border-gray-300 py-2 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </section>

          {/* Actions */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Actions</h2>

            {/* Reason form for reject/suspend */}
            {activeAction && (
              <form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  if (activeAction === 'reject') reject.mutate();
                  else suspend.mutate();
                }}
                className="space-y-2 pb-3 border-b border-gray-100"
              >
                <label htmlFor="reason-input" className="text-xs text-gray-500">
                  {activeAction === 'reject' ? 'Rejection reason (optional)' : 'Suspension reason (optional)'}
                </label>
                <input
                  id="reason-input"
                  type="text"
                  value={reasonInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReasonInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={reject.isPending || suspend.isPending}
                    className={`flex-1 rounded-lg py-2 text-xs font-medium text-white disabled:opacity-50 ${
                      activeAction === 'reject' ? 'bg-gray-700 hover:bg-gray-900' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {activeAction === 'reject'
                      ? (reject.isPending ? 'Rejecting…' : 'Confirm Reject')
                      : (suspend.isPending ? 'Suspending…' : 'Confirm Suspend')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveAction(null); setReasonInput(''); }}
                    className="flex-1 rounded-lg border border-gray-300 py-2 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="flex flex-col gap-2">
              {status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => approve.mutate()}
                    disabled={approve.isPending}
                    className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {approve.isPending ? 'Approving…' : 'Approve Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAction('reject')}
                    disabled={activeAction !== null}
                    className="w-full rounded-lg border border-gray-300 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Reject Application
                  </button>
                </>
              )}

              {status === 'approved' && (
                <button
                  type="button"
                  onClick={() => setActiveAction('suspend')}
                  disabled={activeAction !== null}
                  className="w-full rounded-lg border border-red-300 py-2 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Suspend Distributor
                </button>
              )}

              {status === 'suspended' && (
                <button
                  type="button"
                  onClick={() => unsuspend.mutate()}
                  disabled={unsuspend.isPending}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {unsuspend.isPending ? 'Unsuspending…' : 'Unsuspend Distributor'}
                </button>
              )}

              {status === 'rejected' && (
                <button
                  type="button"
                  onClick={() => approve.mutate()}
                  disabled={approve.isPending}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {approve.isPending ? 'Approving…' : 'Approve (Override Rejection)'}
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Right column: network resellers */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">
                Network Resellers
                {network && (
                  <span className="ml-2 text-xs font-normal text-gray-400">({network.total} total)</span>
                )}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Includes resellers directly invited by this distributor and resellers in their assigned city.
              </p>
            </div>

            {!network ? (
              <div className="px-4 py-10 text-center text-sm text-gray-400">Loading network…</div>
            ) : network.resellers.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-gray-400">
                No resellers in this network yet.
                {dist.assigned_city
                  ? ` Resellers who register in ${dist.assigned_city} will appear here automatically.`
                  : ' Assign a city or invite resellers directly using your referral code.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">Code</th>
                      <th className="px-5 py-3 text-left">City</th>
                      <th className="px-5 py-3 text-center">Link Type</th>
                      <th className="px-5 py-3 text-right">Sales</th>
                      <th className="px-5 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {network.resellers.map((r: NetworkReseller) => {
                      const linkType = resellerLinkType(r, network.assigned_city);
                      return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-mono font-medium text-gray-900">{r.reseller_code}</td>
                          <td className="px-5 py-3 text-gray-600">
                            {r.city ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-5 py-3 text-center">
                            {linkType === 'both' && (
                              <span className="inline-flex text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                                Direct + City
                              </span>
                            )}
                            {linkType === 'direct' && (
                              <span className="inline-flex text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                                Direct Invite
                              </span>
                            )}
                            {linkType === 'city' && (
                              <span className="inline-flex text-xs px-2 py-0.5 rounded-full font-medium bg-teal-100 text-teal-700">
                                City-Based
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-gray-700">
                            ₱{parseFloat(r.total_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-3 text-center text-xs">
                            {r.approved_at
                              ? <span className="text-emerald-600 font-medium">Approved</span>
                              : <span className="text-amber-600 font-medium">Pending</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
