'use client'

import axios from 'axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiEndPoint, colors } from '@/utils/colors';
import { X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from '@/context';
import { AgeGroupsResponse, TiersResponse, StoresResponse, ProductsResponse, UserActivity } from '@/modules/types/data-types'
import { Rewards, RewardInfo, RewardInfoResponse } from '@/modules/types/rewards/rewards-data';
import { Textarea } from "@/components/ui/textarea";
import { TierInfo, TierInfoResponse, LoyaltyTiersProps, LoyaltyTiersResponse } from "@/modules/types/tiers/data-types"


export function AddNewTiers({ onClose }: any) {
    const { user } = useSession();

    const [allStores, setAllStores] = useState<StoresResponse>([])
    const [loyaltyTiers, setLoyaltyTiers] = useState<TiersResponse>([])
    const [ageGroups, setAgeGroups] = useState<AgeGroupsResponse>([])
    const [tierInfo, setTierInfo] = useState<TierInfoResponse>([])

    const [currentTier, setCurrentTier] = useState<LoyaltyTiersProps>({
        tier: '',
        eligibility: '',
        rewards: '',
        discounts: '',
        min_spending_amount: 0,
        max_spending_amount: 0,
    })

    const getStores = async () => {
        try {
            const url = `inventory/get-stores`
            const response = await axios.get<StoresResponse>(`${apiEndPoint}/${url}`)
            setAllStores(response.data)
        } catch (error) {
            console.error('Error RETURNING STORES:', error)
        }
    }

    const getLoyaltyTiers = async () => {
        try {
            const url = `tiers/get-loyalty-tiers`
            const response = await axios.get<TiersResponse>(`${apiEndPoint}/${url}`)
            console.log('TIERS RETURNED !!', response.data)
            setLoyaltyTiers(response.data)
        } catch (error) {
            console.error('Error RETURNING TIERS:', error)
        }
    }

    const getAgeGroups = async () => {
        try {
            const url = `age-group/get-age-groups`
            const response = await axios.get<AgeGroupsResponse>(`${apiEndPoint}/${url}`)
            console.log('AGE_GROUPS RETURNED !!', response.data)
            setAgeGroups(response.data)
        } catch (error) {
            console.error('Error RETURNING AGE_GROUPS:', error)
        }
    }

    const saveTier = async () => {
        try {
            const payload = {
                tier: currentTier.tier,
                eligibility: currentTier.eligibility,
                rewards: currentTier.rewards,
                discounts: currentTier.discounts,
                min_spending_amount: currentTier.min_spending_amount,
                max_spending_amount: currentTier.max_spending_amount
            }

            const url = `tiers/create-tier`
            const response = await axios.post<LoyaltyTiersProps>(`${apiEndPoint}/${url}`, payload)
            console.log('The Tier has been saved:', response)

            if (response.status === 201) {
                toast.success('Reward Saved!', {
                    icon: <Check color={colors.green} size={24} />,
                    duration: 3000,
                    style: {
                        backgroundColor: 'black',
                        color: 'white', 
                    },
                });
            }

            await getTierInfo(); 
        } catch (error) {
            console.error('Error saving Reward:', error)
            
            toast.error('Reward not saved', {
                icon: <X color={colors.red} size={24} />,
                duration: 3000,
            })
        }
    }

    const getTierInfo = async () => {
        try {
            const url = `tiers/get-tier-info/${currentTier.tier}`
            const response = await axios.get<TierInfoResponse>(`${apiEndPoint}/${url}`)
            console.log('REWARD INFO RETURNED!!', response.data)
            setTierInfo(response.data)

            await logUserActivity(response.data[0]); 
        } catch (error) {
            console.error('Error RETURNING REWARD INFO:', error)
        }
    }

    const logUserActivity = async (tierInfo: TierInfo) => {
        const message = "User created a new tier";
        const type = "Tier"

        try {
            const payload = {
                emp_id: user.emp_id,
                emp_name: user.emp_name,
                activity_id: tierInfo.tier_id,
                activity: tierInfo.tier,
                activity_type: type,
                log_message: message
            };

            const url = `logs/log-user-activity`;
            const response = await axios.post<UserActivity>(`${apiEndPoint}/${url}`, payload);
            console.log('The Users activity has been logged!', response.data);

            onClose();
        } catch (error) {
            console.error('Error logging reward activity:', error);
        }
    };


    useEffect(() => {
        getStores();
        getLoyaltyTiers();
        getAgeGroups();
    }, []);


    return (
        <div className="container mx-auto p-4 relative">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <Card className="mb-6 w-[600px]">
                <div className="flex justify-end pr-4 pt-4">
                    <button onClick={ onClose }>
                        <X className="h-4 w-4" color="red" />
                    </button>
                </div>
                <div className="pl-6 pb-4">
                    <p className="text-xl font-bold">Add Tier</p>
                    <p className="text-gray-600">Create new tiers for a loyalty program</p>
                </div>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Label htmlFor="tier">Tier</Label>
                                <Input
                                    id="tier"
                                    value={currentTier.tier} 
                                    onChange={(e) => setCurrentTier(prev => ({ ...prev, tier: e.target.value }))} 
                                    placeholder="Enter tier"
                                />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="eligibility">Eligibility</Label>
                                <Input
                                    id="eligibility"
                                    value={currentTier.eligibility} 
                                    onChange={(e) => setCurrentTier(prev => ({ ...prev, eligibility: e.target.value }))}
                                    placeholder="Enter eligibility"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Label htmlFor="min-spending-amount">Minimum Spending Amount</Label>
                                <Input
                                    id="min-spending-amount"
                                    type="number"
                                    value={currentTier.min_spending_amount} 
                                    onChange={(e) => setCurrentTier(prev => ({ ...prev, min_spending_amount: parseFloat(e.target.value) }))} 
                                    placeholder="Enter maximum spending amount"
                                />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="max-spending-amount">Maximum Spending Amount</Label>
                                <Input
                                    id="max-spending-amount"
                                    type="number"
                                    value={currentTier.max_spending_amount || ''} 
                                    onChange={(e) => setCurrentTier(prev => ({ ...prev, max_spending_amount: parseFloat(e.target.value) }))}
                                    placeholder="Enter maximum spending amount"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-full">
                                <Label htmlFor="discount">Discount</Label>
                                <Textarea 
                                    id="discount"
                                    value={currentTier.discounts} 
                                    onChange={(e) => setCurrentTier(prev => ({ ...prev, discounts: e.target.value }))}
                                    placeholder="Enter discounts available"
                                />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="rewards">Reward</Label>
                                <Textarea 
                                    id="rewards"
                                    value={currentTier.rewards} 
                                    onChange={(e) => setCurrentTier(prev => ({ ...prev, rewards: e.target.value }))}
                                    placeholder="Enter rewards available"
                                />
                            </div>
                        </div>
                        <Button className="bg-green hover:bg-emerald-300" onClick={ saveTier }>
                            Save Tier
                        </Button>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
    )
}