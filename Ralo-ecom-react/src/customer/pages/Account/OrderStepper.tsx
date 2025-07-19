// src/customer/pages/Account/OrderStepper.tsx (Alternative - if you cannot add new date fields to Order interface)

import React from 'react'; // No need for useState or useEffect if steps are static
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Typography } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

import { Order, OrderStatus } from '../../../types/OrderTypes.ts'; // Ensure OrderStatus is imported

interface OrderStepperProps {
    order: Order;
}

const formatDate = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const OrderStepper: React.FC<OrderStepperProps> = ({ order }) => {
    // Define steps based only on available `orderStatus`
    const defaultSteps = [
        { name: "Order Placed", description: `on ${formatDate(order.orderDate)}`, value: OrderStatus.PENDING },
        { name: "Processing", description: "Your order is being processed", value: OrderStatus.SHIPPED }, // Use SHIPPED for "Processing" since you don't have intermediate dates
        { name: "Out For Delivery", description: "Your item is out for delivery", value: OrderStatus.DELIVERED }, // Use DELIVERED for "Out For Delivery" and then actual Delivered
        { name: "Delivered", description: `on ${formatDate(order.deliveryDate)}`, value: OrderStatus.DELIVERED },
    ];

    const cancelledSteps = [
        { name: "Order Placed", description: `on ${formatDate(order.orderDate)}`, value: OrderStatus.PENDING },
        { name: "Order Cancelled", description: `on ${formatDate(order.deliveryDate || new Date())}`, value: OrderStatus.CANCELLED }, // Reusing deliveryDate for cancelled date or current date
    ];

    const stepsToDisplay = order.orderStatus === OrderStatus.CANCELLED ? cancelledSteps : defaultSteps;

    const currentStepIndex = stepsToDisplay.findIndex(step => step.value === order.orderStatus);
    const activeIndex = currentStepIndex !== -1 ? currentStepIndex : 0;

    return (
        <Box className="my-10">
            {stepsToDisplay.map((step, index) => (
                <div key={index} className={`flex px-4 ${index === stepsToDisplay.length - 1 ? '' : 'mb-4'}`}>
                    <div className="flex flex-col items-center">
                        <Box
                            sx={{ zIndex: 1 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center
                                ${index <= activeIndex ? "bg-cyan-400 text-white" : "bg-gray-300 text-gray-600"}
                                ${order.orderStatus === OrderStatus.CANCELLED && step.value === OrderStatus.CANCELLED && index === activeIndex ? "bg-red-500 text-white" : ""}
                            `}
                        >
                            {(index < activeIndex && order.orderStatus !== OrderStatus.CANCELLED) || (step.value === OrderStatus.DELIVERED && index === activeIndex) || (step.value === OrderStatus.CANCELLED && index === activeIndex) ? (
                                <CheckCircleIcon />
                            ) : (
                                <FiberManualRecord />
                            )}
                        </Box>
                        {stepsToDisplay.length - 1 !== index && (
                            <div className={`border h-20 w-[2px] ${index < activeIndex ? "bg-cyan-400" : "bg-gray-300"}`}></div>
                        )}
                    </div>
                    <div className="ml-4 w-full">
                        <div
                            className={`p-2 rounded-md ${step.value === order.orderStatus
                                ? (order.orderStatus === OrderStatus.CANCELLED ? "bg-red-400 text-white" : "bg-cyan-500 text-white")
                                : ""
                                }`}
                        >
                            <Typography variant="body1" className="font-semibold">{step.name}</Typography>
                            <Typography variant="body2" className={`${step.value === order.orderStatus ? "text-gray-100" : "text-gray-500"} text-xs`}>
                                {step.description}
                            </Typography>
                        </div>
                    </div>
                </div>
            ))}
        </Box>
    );
};

export default OrderStepper;