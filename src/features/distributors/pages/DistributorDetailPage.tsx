import {
    approveDistributor,
    assignDistributorCity,
    getDistributor,
    getNetworkResellers,
    rejectDistributor,
    suspendDistributor,
    unassignDistributorCity,
    unsuspendDistributor,
} from '@/features/distributors/api';
import type { Distributor, DistributorRank, NetworkReseller } from '@/features/distributors/types';
import {
    ArrowLeft01Icon,
    Location01Icon,
    Link01Icon,
    UserIcon,
    Task01Icon,
    CheckmarkCircle01Icon,
    AlertCircleIcon,
    Coins01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RANK_COLORS: Record<DistributorRank, string> = {
  STARTER: 'bg-[#F3F4F6] text-[#374151]',
  BRONZE: 'bg-[#FFEDD5] text-[#9A3412]',
  SILVER: 'bg-[#F1F5F9] text-[#475569]',
  GOLD: 'bg-[#FEF9C3] text-[#854D0E]',
  PLATINUM: 'bg-[#CFFAFE] text-[#0E7490]',
  DIAMOND: 'bg-[#EEF2FF] text-[#4338CA]',
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
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const distributorId = Number(id);

  const [cityInput, setCityInput] = useState('');
  const [showCityForm, setShowCityForm] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [activeAction, setActiveAction] = useState<'reject' | 'suspend' | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

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
        <button type="button" onClick={() => void navigate({ to: '/distributors' })}
          className="text-sm text-indigo-600 hover:underline">
          Back to Distributors
        </button>
      </div>
    );
  }

  const assignCityError = assignCity.error instanceof Error ? assignCity.error.message : null;

  return (
    <div className="flex flex-col gap-6 p-2 font-[var(--font-bricolage)] text-[#393939]" style={{ scrollbarGutter: 'stable' }}>

      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div>
          <nav className="mb-1">
            <Link to="/distributors" className="group flex items-center gap-1.5 text-[12px] text-[#A5A5A5] font-medium hover:text-[#393939] transition-colors">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Distributors
            </Link>
          </nav>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#393939]">{dist.distributor_code}</h1>
            <Badge variant="secondary" className={`text-[10px] font-bold px-2 py-0 h-5 rounded-md border-none ${RANK_COLORS[dist.rank]}`}>
              {dist.rank}
            </Badge>
            {status === 'suspended' && (
              <Badge variant="secondary" className="bg-[#FEF2F2] text-[#EF4444] text-[10px] font-bold px-2 py-0 h-5 rounded-md border-none">
                Suspended
              </Badge>
            )}
            {status === 'rejected' && (
              <Badge variant="secondary" className="bg-[#F3F4F6] text-[#6B7280] text-[10px] font-bold px-2 py-0 h-5 rounded-md border-none">
                Rejected
              </Badge>
            )}
            {status === 'pending' && (
              <Badge variant="secondary" className="bg-[#FFFBEB] text-[#F59E0B] text-[10px] font-bold px-2 py-0 h-5 rounded-md border-none">
                Pending Approval
              </Badge>
            )}
            {status === 'approved' && (
              <Badge variant="secondary" className="bg-[#ECFDF5] text-[#10B981] text-[10px] font-bold px-2 py-0 h-5 rounded-md border-none">
                Approved
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#A5A5A5] font-medium">Joined {new Date(dist.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column: info + actions */}
        <div className="lg:col-span-1 space-y-5">

          {/* Info card */}
          <Card className="border-[#F2F2F2] shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center gap-3 pb-4 px-5 pt-5">
              <div className="h-8 w-8 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] shrink-0">
                <HugeiconsIcon icon={UserIcon} size={16} className="text-[#393939]" />
              </div>
              <CardTitle className="text-[15px] font-bold text-[#393939]">Profile</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <dl className="space-y-3 text-[13px]">
                <div className="flex justify-between items-center">
                  <dt className="text-[#A5A5A5] font-medium">Referral Code</dt>
                  <dd className="font-mono font-bold text-[#393939] bg-[#F9F9F9] px-2 py-0.5 rounded border border-[#F2F2F2]">
                    {dist.referral_code ?? '—'}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-[#A5A5A5] font-medium">Personal Sales</dt>
                  <dd className="font-bold text-[#393939]">
                    ₱{parseFloat(dist.total_personal_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-[#A5A5A5] font-medium">Network Sales</dt>
                  <dd className="font-bold text-[#393939]">
                    ₱{parseFloat(dist.total_network_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </dd>
                </div>
                <div className="pt-2 mt-2 border-t border-[#F2F2F2] flex justify-between items-center">
                  <dt className="text-[#A5A5A5] font-medium">Approved Date</dt>
                  <dd className="text-[#393939] font-medium">
                    {dist.approved_at ? new Date(dist.approved_at).toLocaleDateString() : 'Pending'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* City Assignment */}
          <Card className="border-[#F2F2F2] shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center gap-3 pb-2 px-5 pt-5">
              <div className="h-8 w-8 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] shrink-0">
                <HugeiconsIcon icon={Location01Icon} size={16} className="text-[#393939]" />
              </div>
              <div>
                <CardTitle className="text-[15px] font-bold text-[#393939]">City Assignment</CardTitle>
                <p className="text-[11px] text-[#A5A5A5] font-medium leading-tight mt-0.5">
                  One distributor per city territory.
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-2">
              {dist.assigned_city ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#F0F9FF] border border-[#B9E6FE] px-4 py-3">
                    <span className="text-[14px] font-bold text-[#026AA2]">{dist.assigned_city}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => unassignCity.mutate()}
                      disabled={unassignCity.isPending}
                      className="h-8 px-3 text-[12px] font-bold text-[#D92D20] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-lg"
                    >
                      {unassignCity.isPending ? 'Removing…' : 'Remove'}
                    </Button>
                  </div>
                  <p className="text-[11px] text-[#A5A5A5] font-medium italic">
                    Removing this will revert city resellers to direct ordering.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-2 text-[12px] text-[#F97316] font-bold bg-[#FFF7ED] px-3 py-2 rounded-lg border border-[#FFEDD5]">
                    <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                    No city territory assigned.
                  </div>
                  {!showCityForm ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCityForm(true)}
                      className="w-full rounded-xl border-dashed border-[#F2F2F2] h-10 text-[13px] font-bold text-[#393939] hover:bg-[#FAFAFA] shadow-none"
                    >
                      + Assign City Territory
                    </Button>
                  ) : (
                    <form
                      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        if (cityInput.trim()) assignCity.mutate(cityInput.trim());
                      }}
                      className="space-y-3"
                    >
                      <Input
                        value={cityInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCityInput(e.target.value)}
                        placeholder="Enter City Name (e.g. Makati)"
                        className="h-10 border-[#F2F2F2] rounded-xl text-[13px] focus-visible:ring-0 shadow-none px-4"
                      />
                      {assignCityError && (
                        <p className="text-[11px] text-[#EF4444] font-medium">{assignCityError}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={assignCity.isPending || !cityInput.trim()}
                          className="flex-1 rounded-xl bg-[#393939] text-white hover:bg-[#393939]/90 h-10 text-[13px] font-bold shadow-none"
                        >
                          {assignCity.isPending ? 'Assigning…' : 'Assign'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => { setShowCityForm(false); setCityInput(''); }}
                          className="flex-1 rounded-xl border-[#F2F2F2] h-10 text-[13px] font-bold text-[#393939] shadow-none hover:bg-[#FAFAFA]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Link */}
          {dist.referral_code && (
            <Card className="border-[#F2F2F2] shadow-none rounded-2xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center gap-3 pb-2 px-5 pt-5">
                <div className="h-8 w-8 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] shrink-0">
                  <HugeiconsIcon icon={Link01Icon} size={16} className="text-[#393939]" />
                </div>
                <div>
                  <CardTitle className="text-[15px] font-bold text-[#393939]">Registration Link</CardTitle>
                  <p className="text-[11px] text-[#A5A5A5] font-medium leading-tight mt-0.5">
                    Share this to invite direct resellers.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-2">
                {(() => {
                  const registrationUrl = `${window.location.origin}/register/reseller/${dist.referral_code}`;
                  return (
                    <div className="space-y-3 mt-1">
                      <div className="flex items-center gap-2 p-2 bg-[#FAFAFA] border border-[#F2F2F2] rounded-xl overflow-hidden">
                        <span className="flex-1 text-[11px] font-mono text-[#6B7280] truncate px-1">
                          {registrationUrl}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            void navigator.clipboard.writeText(registrationUrl).then(() => {
                              setLinkCopied(true);
                              setTimeout(() => setLinkCopied(false), 2000);
                            });
                          }}
                          className="h-7 px-2.5 text-[11px] font-bold text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg shrink-0"
                        >
                          {linkCopied ? 'Copied!' : 'Copy Link'}
                        </Button>
                      </div>
                      {network && (
                        <div className="flex items-center gap-2 py-1">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((_, i) => (
                              <div key={i} className="h-5 w-5 rounded-full border-2 border-white bg-[#F2F2F2] flex items-center justify-center text-[8px] font-bold text-[#A5A5A5]">
                                {i === 2 ? '+' : ''}
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-[#A5A5A5] font-medium">
                            {network.resellers.filter((r) => r.parent_distributor_id !== null).length} direct invites
                            {network.assigned_city ? ` + ${network.resellers.filter((r) => r.parent_distributor_id === null).length} city-based` : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="border-[#F2F2F2] shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center gap-3 pb-3 px-5 pt-5 border-b border-transparent">
              <div className="h-8 w-8 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9] shrink-0">
                <HugeiconsIcon icon={Task01Icon} size={16} className="text-[#393939]" />
              </div>
              <CardTitle className="text-[15px] font-bold text-[#393939]">Management Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-4">
              {activeAction && (
                <form
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    if (activeAction === 'reject') reject.mutate();
                    else suspend.mutate();
                  }}
                  className="space-y-3 mb-4 pb-4 border-b border-[#F2F2F2]"
                >
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#393939]">
                    <HugeiconsIcon icon={AlertCircleIcon} size={14} className="text-[#F97316]" />
                    {activeAction === 'reject' ? 'Provide rejection reason' : 'Provide suspension reason'}
                  </div>
                  <Input
                    value={reasonInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReasonInput(e.target.value)}
                    placeholder="Type reason here (optional)"
                    className="h-10 border-[#F2F2F2] rounded-xl text-[13px] focus-visible:ring-0 shadow-none"
                  />
                  <div className="flex gap-2 text-white">
                    <Button
                      type="submit"
                      disabled={reject.isPending || suspend.isPending}
                      className={`flex-1 rounded-xl h-10 text-[13px] font-bold shadow-none ${
                        activeAction === 'reject' ? 'bg-[#374151] hover:bg-[#1F2937]' : 'bg-[#D92D20] hover:bg-[#B42318]'
                      }`}
                    >
                      {activeAction === 'reject'
                        ? (reject.isPending ? 'Rejecting…' : 'Confirm Reject')
                        : (suspend.isPending ? 'Suspending…' : 'Confirm Suspend')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setActiveAction(null); setReasonInput(''); }}
                      className="flex-1 rounded-xl border-[#F2F2F2] h-10 text-[13px] font-bold text-[#393939] shadow-none hover:bg-[#FAFAFA]"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="flex flex-col gap-2.5">
                {status === 'pending' && (
                  <>
                    <Button
                      onClick={() => approve.mutate()}
                      disabled={approve.isPending || activeAction !== null}
                      className="w-full rounded-xl bg-[#10B981] text-white hover:bg-[#059669] h-11 text-[13px] font-bold shadow-none border-none"
                    >
                      {approve.isPending ? 'Approving…' : 'Approve Application'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveAction('reject')}
                      disabled={activeAction !== null}
                      className="w-full rounded-xl border-[#F2F2F2] h-11 text-[13px] font-bold text-[#374151] shadow-none hover:bg-[#FAFAFA]"
                    >
                      Reject Application
                    </Button>
                  </>
                )}

                {status === 'approved' && (
                  <Button
                    variant="outline"
                    onClick={() => setActiveAction('suspend')}
                    disabled={activeAction !== null}
                    className="w-full rounded-xl border-[#FDA29B] h-11 text-[13px] font-bold text-[#D92D20] shadow-none hover:bg-[#FEF3F2] hover:border-[#F97066]"
                  >
                    Suspend Distributor
                  </Button>
                )}

                {status === 'suspended' && (
                  <Button
                    onClick={() => unsuspend.mutate()}
                    disabled={unsuspend.isPending || activeAction !== null}
                    className="w-full rounded-xl bg-[#10B981] text-white hover:bg-[#059669] h-11 text-[13px] font-bold shadow-none border-none"
                  >
                    {unsuspend.isPending ? 'Unsuspending…' : 'Unsuspend Distributor'}
                  </Button>
                )}

                {status === 'rejected' && (
                  <Button
                    onClick={() => approve.mutate()}
                    disabled={approve.isPending || activeAction !== null}
                    className="w-full rounded-xl bg-[#10B981] text-white hover:bg-[#059669] h-11 text-[13px] font-bold shadow-none border-none"
                  >
                    {approve.isPending ? 'Approving…' : 'Approve (Override Rejection)'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: network resellers */}
        <div className="lg:col-span-2">
          <Card className="border-[#F2F2F2] shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-col gap-1 pb-4 px-6 pt-6 border-b border-[#F2F2F2]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9]">
                    <HugeiconsIcon icon={Coins01Icon} size={18} className="text-[#393939]" />
                  </div>
                  <CardTitle className="text-[16px] font-bold text-[#393939]">
                    Network Resellers
                    {network && (
                      <span className="ml-2 text-[12px] font-medium text-[#A5A5A5]">({network.total} total)</span>
                    )}
                  </CardTitle>
                </div>
              </div>
              <p className="text-[12px] text-[#A5A5A5] font-medium mt-1">
                Direct invites and city-based automatic registrations in this network.
              </p>
            </CardHeader>

            {!network ? (
              <div className="px-6 py-20 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F9F9F9] border border-[#F2F2F2] mb-4">
                  <HugeiconsIcon icon={UserIcon} size={24} className="text-[#A5A5A5] animate-pulse" />
                </div>
                <p className="text-[14px] text-[#A5A5A5] font-medium">Loading network data…</p>
              </div>
            ) : network.resellers.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FAFAFA] border border-[#F2F2F2] mb-4">
                  <HugeiconsIcon icon={UserIcon} size={24} className="text-[#D1D1D1]" />
                </div>
                <p className="text-[14px] text-[#393939] font-bold">No resellers yet</p>
                <p className="text-[12px] text-[#A5A5A5] font-medium mt-1 max-w-[280px] mx-auto">
                  {dist.assigned_city
                    ? `Resellers registering in ${dist.assigned_city} will automatically appear here.`
                    : 'Assign a city territory or share the referral code to start growing the network.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="px-6 h-12 text-[12px] font-medium text-[#A5A5A5] uppercase tracking-wider">Reseller Code</TableHead>
                      <TableHead className="px-6 h-12 text-[12px] font-medium text-[#A5A5A5] uppercase tracking-wider">City</TableHead>
                      <TableHead className="px-6 h-12 text-[12px] font-medium text-[#A5A5A5] uppercase tracking-wider text-center">Link Type</TableHead>
                      <TableHead className="px-6 h-12 text-[12px] font-medium text-[#A5A5A5] uppercase tracking-wider text-right">Total Sales</TableHead>
                      <TableHead className="px-6 h-12 text-[12px] font-medium text-[#A5A5A5] uppercase tracking-wider text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {network.resellers.map((r: NetworkReseller) => {
                      const linkType = resellerLinkType(r, network.assigned_city);
                      return (
                        <TableRow key={r.id} className="border-t border-[#F2F2F2] hover:bg-[#FAFAFA]/50 transition-colors">
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="bg-[#F2F2F2] text-[10px] font-bold text-[#393939]">
                                  {r.reseller_code.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-[13px] font-bold text-[#393939] font-mono">{r.reseller_code}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-[13px] font-medium text-[#6B7280]">
                            {r.city ?? <span className="text-[#D1D5DB]">—</span>}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            {linkType === 'both' && (
                              <Badge variant="secondary" className="bg-[#F5F3FF] text-[#7B61FF] text-[10px] font-bold border-none px-2">
                                Direct + City
                              </Badge>
                            )}
                            {linkType === 'direct' && (
                              <Badge variant="secondary" className="bg-[#EFF6FF] text-[#3B82F6] text-[10px] font-bold border-none px-2">
                                Direct Invite
                              </Badge>
                            )}
                            {linkType === 'city' && (
                              <Badge variant="secondary" className="bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold border-none px-2">
                                City-Based
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <span className="text-[13px] font-bold text-[#393939]">
                              ₱{parseFloat(r.total_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            {r.approved_at ? (
                              <div className="flex items-center justify-center gap-1.5 text-[#10B981]">
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} />
                                <span className="text-[12px] font-bold">Approved</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5 text-[#F59E0B]">
                                <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                                <span className="text-[12px] font-bold">Pending</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}


