"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndPoint } from '@/utils/colors'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PercentDiamond, Coins, Coffee, BadgeCheck, BadgeInfo, AlertTriangle, Users, Clock } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import SquareCircleLoader from "@/lib/square-circle-loader"

interface RewardProps {
    reward_id: number,
    reward_title: string,
    description: string,
    reward: string,
    reward_type: string,
    reward_price: string,
    store_id: string,
    region: string,
    start_date: string,
    expiry_date: string,
    loyalty_tier: string,
    age_group: string,
    isActive: number
    insertedAt: string,
    updatedAt: string
}

interface RewardsResponse {
    message: string;
    results: RewardProps[];
}

export const UpcomingRewardsCards = () => {
    const [upcomingRewards, setUpcomingRewards] = useState<RewardProps[]>([]);

    const [loadingRewards, setLoadingRewards] = useState(false);
    const [rewardError, setRewardError] = useState(false);


    const getUpcomingRewards = async () => {
        setLoadingRewards(true);

        try {
            const url = `rewards/get-upcoming-rewards`
            const response = await axios.get<RewardsResponse>(`${apiEndPoint}/${url}`);
            setUpcomingRewards(response.data.results);
            console.log('Upcoming Rewards: ', response.data);
    
        } catch (error) {
            console.log("An error occurred when fetching the Upcoming rewards");
            setRewardError(true);
        }
    
        setLoadingRewards(false);
    }

    const getSpecialTypeIcon = (special_value: string) => {
        switch (special_value) {
            case 'Percentage':
                return <PercentDiamond className="h-4 w-4 sm:h-5 sm:w-5 text-blue" />;
            case 'Amount':
                return <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-blue" />;
            case 'Free':
                return <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-blue" />;
            default:
                return <BadgeInfo className="h-4 w-4 sm:h-5 sm:w-5 text-blue" />;
        }
    };

    useEffect(() => {
        getUpcomingRewards();

        const interval = setInterval(() => {
            getUpcomingRewards();
        }, 300000); 

        return () => clearInterval(interval);
    }, []);


    if (loadingRewards) {
        return (
            <div className="flex flex-col justify-center items-center gap-4">
                <SquareCircleLoader />
                <p className="text-gray-600 text-sm uppercase">loading upcoming rewards...</p>
            </div>
        )
    }


    if (rewardError) {
        return (
            <div className="flex flex-col justify-center items-center gap-4">
                <AlertTriangle size={38} color="red"/>
                <p className="text-gray-600 text-sm uppercase">Oops! Unfortunately an error was encountered when fetching Upcoming Rewards, kindly refresh the page.</p>
            </div>
        )
    }


    if (upcomingRewards.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center gap-4">
                <BadgeInfo size={38} className="text-emerald-500"/>
                <p className="text-gray-600 text-sm uppercase">No rewards are currently available. To add new rewards, please navigate to the Admin page.</p>
            </div>
        )
    }


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {upcomingRewards?.map(({ reward_id, reward_title, description, reward, reward_type, reward_price, store_id, region, start_date, expiry_date, loyalty_tier, age_group, isActive }) => (
            <Card key={reward_id} className="shadow-lg hover:shadow-xl w-[400px] sm:flex flex-col md:w-[400px] lg:w-[400px]">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <CardTitle className="text-base sm:text-lg">{reward_title}</CardTitle>
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    {getSpecialTypeIcon(reward_type)} { /* render different icons based on special value */ }
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{reward_type === 'Free' ? 'Free Item' : reward_type}</p>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Upcoming</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground space-x-1">
                        <span>{store_id || "'no-store'"} | {region || "'no-region'"} | {loyalty_tier || "'no-tier'"}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="font-bold text-base sm:text-lg">{reward}</p>
                    <div className="flex flex-col pt-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">Valid From:</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{start_date} - {expiry_date}</p>
                    </div>
                    <div className="mt-2 flex items-center">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-purple" />
                        <span className="text-xs sm:text-sm text-purple-600 font-semibold pl-2">0</span>
                    </div>
                </CardContent>
            </Card>
        ))}
        </div>
    )
}