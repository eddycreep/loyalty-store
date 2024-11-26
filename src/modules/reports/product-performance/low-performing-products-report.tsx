"use client"

import { apiEndPoint, colors } from '@/utils/colors';
import * as React from "react";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { Check, X, BadgeAlert, AlertTriangle, Filter, XOctagon, ShieldAlert } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import SquareCircleLoader from "@/lib/square-circle-loader";
import { Label } from "@/components/ui/label";

interface LowPerformingProductData {
    store_id: string;
    store_name: string;
    product_id: string;
    product_name: string;
    category: string;
    total_sales: number;
    total_revenue: number;
    total_discount_amount: number;
    discount_usage_rate: number;
    avg_discount: number;
    gross_margin: number;
    customer_count: number;
    date: string;
}

const lowPerformingProductsReport: LowPerformingProductData[] = [
    {
        store_id: 'SOO1',
        store_name: 'PLUS DC Stellenbosch',
        product_id: 'P001',
        product_name: 'Apple',
        category: 'Groceries',
        total_sales: 120,
        total_revenue: 3000.50,
        total_discount_amount: 150.25,
        discount_usage_rate: 12.5,
        avg_discount: 5.0,
        gross_margin: 20.0,
        customer_count: 60,
        date: '2024-10-01',
    },
    {
        store_id: 'SOO2',
        store_name: 'PLUS DC Albertin',
        product_id: 'P002',
        product_name: 'Switch 440ML',
        category: 'Electronics',
        total_sales: 80,
        total_revenue: 5000.75,
        total_discount_amount: 200.50,
        discount_usage_rate: 10.0,
        avg_discount: 8.0,
        gross_margin: 25.0,
        customer_count: 40,
        date: '2024-10-02',
    },
    {
        store_id: 'SOO3',
        store_name: 'PLUS DC Bellville',
        product_id: 'P003',
        product_name: 'Chips',
        category: 'Fashion',
        total_sales: 90,
        total_revenue: 4000.00,
        total_discount_amount: 100.75,
        discount_usage_rate: 9.5,
        avg_discount: 6.0,
        gross_margin: 18.0,
        customer_count: 55,
        date: '2024-10-03',
    }
];

const stores = [
    { id: 1, store_id: 'SOO1', store: 'PLUS DC Stellenbosch' },
    { id: 2, store_id: 'SOO2', store: 'PLUS DC Albertin' },
    { id: 3, store_id: 'SOO3', store: 'PLUS DC Bellville' },
    { id: 4, store_id: 'SOO4', store: 'PLUS DC Nelspruit' },
    { id: 5, store_id: 'SOO5', store: 'PLUS DC Durbanville' },
    { id: 6, store_id: 'SOO6', store: 'PLUS DC Bloemfontein' },
    { id: 7, store_id: 'SOO7', store: 'PLUS DC Cape Town' },
    { id: 8, store_id: 'SOO8', store: 'PLUS DC Pietermaritzburg' },
    { id: 9, store_id: 'SOO9', store: 'PLUS DC East London' },
    { id: 10, store_id: 'SOO10', store: 'PLUS DC Pretoria' },
    { id: 11, store_id: 'SOO11', store: 'PLUS DC Germiston' },
    { id: 12, store_id: 'SOO12', store: 'PLUS DC Polokwane' },
];


const storeRegions = [
    { id: 1, region: 'Eastern Cape'}, 
    { id: 2, region: 'Free State'}, 
    { id: 3, region: 'Gauteng'},
    { id: 4, region: 'KwaZulu-Natal'},
    { id: 5, region: 'Limpopo'}, 
    { id: 6, region: 'Mpumalanga'},
    { id: 7, region: 'Northern Cape'},
    { id: 8, region: 'North West'},
    { id: 9, region: 'Western Cape'}
];

export const LowPerformingProductsReport = () => {
    const headers = ['Store ID', 'Store Name', 'Product ID', 'Product Name', 'Category', 'Date', 'Total Sales', 'Total Revenue', 'Total Discount', 'Usage Rate (%)', 'Avg. Discount (%)', 'Customer Count'];

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedStore, setSelectedStore] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');

    const [filteredData, setFilteredData] = useState<LowPerformingProductData[]>([]);
    const [isLoading, setIsLoading] = useState(false); 
    const [isError, setIsError] = useState(false);
    const [hasFiltered, setDataHasFiltered] = useState(false);


    const handleFilter = () => {
        setIsLoading(true);
        let filtered = lowPerformingProductsReport;

        // Filter by date range
        if (startDate && endDate) {
            filtered = filtered.filter(item => item.date >= startDate && item.date <= endDate);
        }

        // Filter by selected store
        if (selectedStore !== 'All') {
            filtered = filtered.filter(item => item.store_id === selectedStore);
        }

        setFilteredData(filtered);
        setDataHasFiltered(true);

        if (filtered.length === 0) {
            setIsError(true);
            toast.error('No data found for the selected filters!', {
                icon: <X color={colors.red} size={24} />,
                duration: 3000,
            });
        } else {
            setIsError(false);
        }

        setIsLoading(false);
    };


    if (isLoading) {
        return (
            <div className="h-screen overflow-y-auto pl-2 pt-4">
                <div className='flex gap-4'>
                    <div className="pt-6">
                        <div className="flex gap-4">
                            <div className="w-[270px]">
                                <Label htmlFor="username" className="text-left pt-4">
                                    Start Date:
                                </Label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300'/>
                            </div>
                            <div className="w-[270px]">
                                <Label htmlFor="username" className="text-left pt-4">
                                    Expiry Date:
                                </Label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300'/>
                            </div>
                        </div>
                    </div>
                    <div className="w-[300px] flex flex-col pt-4">
                        <Label htmlFor="storeid" className="text-left pt-4 pb-1">
                            Store ID:
                        </Label>
                        <select
                            className="w-full p-2 rounded-lg border border-gray-300"
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                        >
                            <option value="All">All</option>
                            {stores.map(({ id, store_id, store }) => (
                                <option key={id} value={store_id}>
                                    {store_id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-[300px] flex flex-col pt-4">
                        <Label htmlFor="storeid" className="text-left pt-4 pb-1">
                            Regions:
                        </Label>
                        <select
                            className="w-full p-2 rounded-lg border border-gray-300"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            <option value="All">All</option>
                            {storeRegions.map((region) => (
                                <option key={region.id} value={region.region}>
                                    {region.region}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end w-full pt-12">
                        <button className="bg-red hover:bg-black text-white w-20 h-11 rounded shadow-lg flex items-center justify-center" onClick={handleFilter}>
                            <Filter />
                        </button>
                    </div>
                </div>

                <div className="pt-20 flex flex-col items-center justify-center">
                    <SquareCircleLoader />
                    <p className="text-gray-500 uppercase pt-4">Loading data, please be patient.</p>
                </div>
            </div>
        );
    }


    if (isError) {
        return (
            <div className="h-screen overflow-y-auto pl-2 pt-4">
                <div className='flex gap-4'>
                    <div className="pt-6">
                        <div className="flex gap-4">
                            <div className="w-[270px]">
                                <Label htmlFor="username" className="text-left pt-4">
                                    Start Date:
                                </Label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300'/>
                            </div>
                            <div className="w-[270px]">
                                <Label htmlFor="username" className="text-left pt-4">
                                    Expiry Date:
                                </Label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300'/>
                            </div>
                        </div>
                    </div>
                    <div className="w-[300px] flex flex-col pt-4">
                        <Label htmlFor="storeid" className="text-left pt-4 pb-1">
                            Store ID:
                        </Label>
                        <select
                            className="w-full p-2 rounded-lg border border-gray-300"
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                        >
                            <option value="All">All</option>
                            {stores.map(({ id, store_id, store }) => (
                                <option key={id} value={store_id}>
                                    {store_id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-[300px] flex flex-col pt-4">
                        <Label htmlFor="storeid" className="text-left pt-4 pb-1">
                            Regions:
                        </Label>
                        <select
                            className="w-full p-2 rounded-lg border border-gray-300"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            <option value="All">All</option>
                            {storeRegions.map((region) => (
                                <option key={region.id} value={region.region}>
                                    {region.region}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end w-full pt-12">
                        <button className="bg-red hover:bg-black text-white w-20 h-11 rounded shadow-lg flex items-center justify-center" onClick={handleFilter}>
                            <Filter />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-20">
                    <XOctagon size={44} />
                    <p className="ml-2 uppercase pt-2 text-red">An error occured when fetching report data</p>
                </div>
            </div>
        );
    }


    if (hasFiltered && filteredData.length === 0) {
        return (
            <div className="h-screen overflow-y-auto pl-2 pt-4">
                <div className='flex gap-4'>
                    <div className="pt-6">
                        <div className="flex gap-4">
                            <div className="w-[270px]">
                                <Label htmlFor="username" className="text-left pt-4">
                                    Start Date:
                                </Label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300'/>
                            </div>
                            <div className="w-[270px]">
                                <Label htmlFor="username" className="text-left pt-4">
                                    Expiry Date:
                                </Label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300'/>
                            </div>
                        </div>
                    </div>
                    <div className="w-[300px] flex flex-col pt-4">
                        <Label htmlFor="storeid" className="text-left pt-4 pb-1">
                            Store ID:
                        </Label>
                        <select
                            className="w-full p-2 rounded-lg border border-gray-300"
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                        >
                            <option value="All">All</option>
                            {stores.map(({ id, store_id, store }) => (
                                <option key={id} value={store_id}>
                                    {store_id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-[300px] flex flex-col pt-4">
                        <Label htmlFor="storeid" className="text-left pt-4 pb-1">
                            Regions:
                        </Label>
                        <select
                            className="w-full p-2 rounded-lg border border-gray-300"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            <option value="All">All</option>
                            {storeRegions.map((region) => (
                                <option key={region.id} value={region.region}>
                                    {region.region}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end w-full pt-12">
                        <button className="bg-red hover:bg-black text-white w-20 h-11 rounded shadow-lg flex items-center justify-center" onClick={handleFilter}>
                            <Filter />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-20">
                    <ShieldAlert size={44} />
                    <p className="ml-2 uppercase pt-2 text-green">There is no data available for the selected dates</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-auto pl-2 pt-4">
            <div className='flex gap-4'>
                <div className="pt-6">
                    <div className="flex gap-4">
                        <div className="w-[270px]">
                            <Label htmlFor="username" className="text-left pt-4">
                                Start Date:
                            </Label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300'/>
                        </div>
                        <div className="w-[270px]">
                            <Label htmlFor="username" className="text-left pt-4">
                                Expiry Date:
                            </Label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300'/>
                        </div>
                    </div>
                </div>
                <div className="w-[300px] flex flex-col pt-4">
                    <Label htmlFor="storeid" className="text-left pt-4 pb-1">
                        Store ID:
                    </Label>
                    <select
                        className="w-full p-2 rounded-lg border border-gray-300"
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                    >
                        <option value="All">All</option>
                        {stores.map(({ id, store_id, store }) => (
                            <option key={id} value={store_id}>
                                {store_id}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-[300px] flex flex-col pt-4">
                    <Label htmlFor="storeid" className="text-left pt-4 pb-1">
                        Regions:
                    </Label>
                    <select
                        className="w-full p-2 rounded-lg border border-gray-300"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="All">All</option>
                        {storeRegions.map((region) => (
                            <option key={region.id} value={region.region}>
                                {region.region}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end w-full pt-12">
                    <button className="bg-red hover:bg-black text-white w-20 h-11 rounded shadow-lg flex items-center justify-center" onClick={handleFilter}>
                        <Filter />
                    </button>
                </div>
            </div>

            <div className="bg-white text-gray-500 flex items-center justify-between divide-x divide-gray-500 p-3 mt-4 rounded shadow-lg">
                {headers.map((header, index) => (
                    <p key={index} className={`text-xs uppercase font-medium flex-1 text-center ${index === 1 ? 'hidden lg:block' : ''}`}>
                        {header}
                    </p>
                ))}
            </div>

            <div className="pt-2 max-h-screen pb-2 space-y-2">
                {filteredData.map(({ store_id, store_name, product_id, product_name, category, total_sales, total_revenue, total_discount_amount, discount_usage_rate, avg_discount, gross_margin, customer_count, date }) => (
                    <div key={store_id} className="bg-white flex flex-col p-3 rounded shadow-lg">
                        <div className="flex items-center justify-between divide-x divide-gray-300">
                            <p className="text-sm flex-1 text-center text-red">{store_id}</p>
                            <p className="text-sm flex-1 text-center">{store_name}</p>
                            <p className="text-sm flex-1 text-center">{product_id}</p>
                            <p className="text-sm flex-1 text-center">{product_name}</p>
                            <p className="text-sm flex-1 text-center">{category}</p>
                            <p className="text-sm flex-1 text-center">{date}</p>
                            <p className="text-sm flex-1 text-center">{total_sales}</p>
                            <p className="text-sm flex-1 text-center">R{total_revenue}</p>
                            <p className="text-sm flex-1 text-center">R{total_discount_amount}</p>
                            <p className="text-sm flex-1 text-center">{discount_usage_rate}%</p>
                            <p className="text-sm flex-1 text-center">{avg_discount}%</p>
                            {/* <p className="text-sm flex-1 text-center">{gross_margin}</p> */}
                            <p className="text-sm flex-1 text-center">{customer_count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};