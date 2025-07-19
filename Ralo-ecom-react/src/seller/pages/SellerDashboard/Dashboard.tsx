import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Card, CardContent, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, Button, LinearProgress, useTheme, Tooltip, IconButton } from '@mui/material';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { useNavigate } from 'react-router-dom';
import { cyan, purple, grey } from '@mui/material/colors';
import { Refresh, MonetizationOn, ShoppingCart, Inventory, AttachMoney, Edit, Delete } from '@mui/icons-material';
import { deleteProduct } from '../../../State/customer/ProductSlice.ts';
import { fetchSellerDashboardStats, fetchSellerDashboardTrends, fetchSellerProfile } from '../../../State/seller/sellerSlice.ts';
import { fetchSellerOrders, updateOrderStatus } from '../../../State/seller/sellerOrderSlice.ts';
import { fetchSellerProducts } from '../../../State/seller/sellerProductSlice.ts';
import { OrderStatus } from '../../../types/OrderTypes.ts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, ChartTooltip, Legend);

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, trends, profile, orders, products, loading, trendsLoading, error, trendsError } = useAppSelector((state) => state.seller);
  const [timeframe, setTimeframe] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    console.log('Stats:', stats, 'Trends:', trends, 'Profile:', profile); // Debug data
    dispatch(fetchSellerDashboardStats({ timeframe }));
    dispatch(fetchSellerDashboardTrends({ timeframe }));
    dispatch(fetchSellerProfile());
    dispatch(fetchSellerOrders());
    dispatch(fetchSellerProducts("sdf"));
  }, [dispatch, timeframe]);

  const handleTimeframeChange = (event: any) => {
    setTimeframe(event.target.value);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    Promise.all([
      dispatch(fetchSellerDashboardStats({ timeframe })),
      dispatch(fetchSellerDashboardTrends({ timeframe })),
      dispatch(fetchSellerProfile()),
      dispatch(fetchSellerOrders()),
      dispatch(fetchSellerProducts("sdf")),
    ]).finally(() => setIsRefreshing(false));
  };

  const handleUpdateOrderStatus = (orderId: number, status: OrderStatus) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  if (loading && !isRefreshing) return (
    <Box sx={{ p: 8, textAlign: 'center', bgcolor: '#f9f9f9' }}>
      <LinearProgress color="primary" />
      <Typography sx={{ mt: 2, color: purple[700] }}>Loading Dashboard...</Typography>
    </Box>
  );
  if (error) return (
    <Box sx={{ p: 8, textAlign: 'center' }}>
      <Typography color="error">Error: {error}</Typography>
    </Box>
  );

  // Line chart data
  const lineChartData = trends ? {
    labels: trends.labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: trends.revenue,
        borderColor: cyan[600],
        backgroundColor: `${cyan[100]}80`,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Orders',
        data: trends.orders,
        borderColor: purple[600],
        backgroundColor: `${purple[100]}80`,
        tension: 0.4,
        fill: true,
      },
    ],
  } : {
    labels: [],
    datasets: [
      { label: 'Revenue ($)', data: [], borderColor: cyan[600], backgroundColor: `${cyan[100]}80`, tension: 0.4, fill: true },
      { label: 'Orders', data: [], borderColor: purple[600], backgroundColor: `${purple[100]}80`, tension: 0.4, fill: true },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Value' } },
      x: { title: { display: true, text: 'Month' } },
    },
    plugins: { legend: { position: 'top' } },
  };

  // Doughnut chart for order status
  const doughnutChartData = stats ? {
    labels: ['Completed', 'Cancelled', 'Pending'],
    datasets: [{
      data: [stats.completedOrders, stats.cancelledOrders, stats.pendingOrders],
      backgroundColor: [cyan[500], purple[500], cyan[200]],
      borderColor: ['#fff'],
      borderWidth: 2,
    }],
  } : {
    labels: ['Completed', 'Cancelled', 'Pending'],
    datasets: [{ data: [0, 0, 0], backgroundColor: [cyan[500], purple[500], cyan[200]], borderColor: ['#fff'], borderWidth: 2 }],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } },
  };

  return (
    <Box sx={{ p: 8, maxWidth: 'xxl', mx: 'auto', bgcolor: '#f9f9f9', minHeight: '100vh' }} className="bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8, bgcolor: 'white', p: 4, borderRadius: 3, boxShadow: `0 4px 20px ${cyan[100]}33` }} className="shadow-lg">
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: purple[800] }}>
            Seller Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: purple[700] }}>Timeframe</InputLabel>
              <Select value={timeframe} onChange={handleTimeframeChange} label="Timeframe" sx={{ bgcolor: 'white', borderRadius: 2 }}>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} disabled={isRefreshing} sx={{ color: cyan[600], bgcolor: grey[50], '&:hover': { bgcolor: cyan[50] } }}>
                <Refresh sx={{ fontSize: 30, animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Profile Section */}
        {profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card sx={{ borderRadius: 3, boxShadow: `0 8px 30px ${cyan[100]}33`, bgcolor: 'white', p: 4, mb: 8 }} className="shadow-lg rounded-xl">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h4" sx={{ color: purple[800], fontWeight: 'bold' }}>
                    Seller Profile
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: cyan[600], color: 'white', '&:hover': { bgcolor: cyan[700] } }}
                    onClick={() => navigate('/seller/profile')}
                  >
                    Edit Profile
                  </Button>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <Typography variant="h6">Business Name: {profile.businessDetails.businessName}</Typography>
                    <Typography>Email: {profile.email}</Typography>
                    <Typography>Mobile: {profile.mobile}</Typography>
                    <Typography>GSTIN: {profile.gstin}</Typography>
                    <Typography>Status: {profile.accountStatus}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <Typography variant="h6">Bank Details</Typography>
                    <Typography>Account: {profile.bankDetails.accountNumber}</Typography>
                    <Typography>Holder: {profile.bankDetails.accountHolderName}</Typography>
                    <Typography>IFSC: {profile.bankDetails.ifscCode}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">Pickup Address</Typography>
                    <Typography>{profile.pickupAddress.address}, {profile.pickupAddress.locality}, {profile.pickupAddress.city}, {profile.pickupAddress.state} - {profile.pickupAddress.pinCode}</Typography>
                    <Typography>Mobile: {profile.pickupAddress.mobile}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* KPI Cards */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 8 }}>
            {[
              { title: 'Total Revenue', value: `$${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}`, color: cyan[600], icon: <MonetizationOn fontSize="large" sx={{ color: purple[400] }} />, tooltip: 'Total revenue from your orders' },
              { title: 'Total Orders', value: stats.totalOrders, color: purple[600], icon: <ShoppingCart fontSize="large" sx={{ color: purple[400] }} />, tooltip: 'Total orders placed' },
              { title: 'Active Products', value: stats.activeProducts, color: cyan[500], icon: <Inventory fontSize="large" sx={{ color: purple[400] }} />, tooltip: 'Products with stock > 0' },
              { title: 'Avg. Order Value', value: `$${stats.averageOrderValue.toFixed(2)}`, color: purple[500], icon: <AttachMoney fontSize="large" sx={{ color: purple[400] }} />, tooltip: 'Average revenue per order' },
            ].map((kpi, index) => (
              <Grid size={{ xs: 12, sm: 3, md: 3 }} key={kpi.title}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.2, duration: 0.4 }}>
                  <Tooltip title={kpi.tooltip}>
                    <Card
                      sx={{
                        bgcolor: `linear-gradient(135deg, ${kpi.color}, ${kpi.color}99)`,
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: `0 8px 30px ${kpi.color}33`,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': { transform: 'translateY(-10px) scale(1.05)', boxShadow: `0 16px 60px ${kpi.color}80` },
                        zIndex: 1,
                        p: 1,
                      }}
                      className="shadow-lg rounded-xl"
                      data-testid={`kpi-${kpi.title.toLowerCase().replace(' ', '-')}`}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        {kpi.icon}
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '1.2rem',
                              background: `linear-gradient(45deg, ${cyan[400]}, ${purple[400]})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontWeight: 'medium',
                            }}
                            data-testid={`kpi-title-${kpi.title.toLowerCase().replace(' ', '-')}`}
                          >
                            {kpi.title}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 'bold',
                              background: `linear-gradient(45deg, ${cyan[400]}, ${purple[400]})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                            data-testid={`kpi-value-${kpi.title.toLowerCase().replace(' ', '-')}`}
                          >
                            {kpi.value}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Tooltip>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Charts */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card sx={{ borderRadius: 3, boxShadow: `0 8px 30px ${cyan[100]}33`, bgcolor: 'white', p: 4, border: `1px solid ${cyan[100]}` }} className="shadow-lg rounded-xl">
                <CardContent>
                  <Typography variant="h4" gutterBottom sx={{ color: purple[800], fontWeight: 'bold' }}>
                    Revenue & Orders Trend
                  </Typography>
                  {trendsLoading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <LinearProgress color="primary" />
                      <Typography>Loading Trends...</Typography>
                    </Box>
                  ) : trendsError ? (
                    <Typography color="error">Error: {trendsError}</Typography>
                  ) : (
                    <Box sx={{ height: 400 }}>
                      <Line data={lineChartData} options={lineChartOptions} />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card sx={{ borderRadius: 3, boxShadow: `0 8px 30px ${purple[100]}33`, bgcolor: 'white', p: 4, border: `1px solid ${purple[100]}` }} className="shadow-lg rounded-xl">
                <CardContent>
                  <Typography variant="h4" gutterBottom sx={{ color: purple[800], fontWeight: 'bold' }}>
                    Order Status
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard;