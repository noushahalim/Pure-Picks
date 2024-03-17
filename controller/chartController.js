const signUpModel = require('../model/clientSignUpModel');
const orderModel = require('../model/orderModel');
const productModel = require('../model/productModel');


exports.lineChartDataGet = async (req, res) => {
    try {
        const currentDate = new Date();
        const sixMonthsAgoDate = new Date();
        sixMonthsAgoDate.setMonth(currentDate.getMonth() - 6);

        const orders = await orderModel.aggregate([
            {
                $addFields: {
                    orderDate: {
                        $let: {
                            vars: {
                                dateString: { $substr: ["$orderDate", 0, 24] }
                            },
                            in: { $toDate: "$$dateString" }
                        }
                    }
                }
            },
            {
                $match: {
                    orderDate: { $gte: sixMonthsAgoDate }
                }
            }
        ]);
        
        const labels = [];
        const salesData = [];
        const currentDateMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const monthlySales = Array(6).fill(0);

        orders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            const orderMonth = orderDate.getMonth() + 1;
            const orderYear = orderDate.getFullYear();
            const monthIndex = (currentYear - orderYear) * 12 + (currentDateMonth - orderMonth);
            if (monthIndex >= 0 && monthIndex < 6) {
                monthlySales[monthIndex] += order.discountedPrice;
            }
        });

        for (let i = 0; i < 6; i++) {
            const month = (currentDateMonth - i) <= 0 ? 12 + (currentDateMonth - i) : currentDateMonth - i;
            const year = (currentDateMonth - i) <= 0 ? currentYear - 1 : currentYear;
            const formattedDate = `${year}-${month < 10 ? '0' + month : month}`;
            labels.unshift(formattedDate);
            salesData.unshift(monthlySales[i]);
        }

        res.json({ labels, salesData });
    } catch (error) {
        console.error('Error fetching line chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.barChartDataGet = async (req, res) => {
    try {
        const currentDate = new Date();

        const sixMonthsAgoDate = new Date();
        sixMonthsAgoDate.setMonth(currentDate.getMonth() - 6);

        const userCounts = await signUpModel.aggregate([
            {
                $addFields: {
                    registerDate: {
                        $let: {
                            vars: {
                                dateString: { $substr: ["$registerDate", 0, 24] }
                            },
                            in: { $toDate: "$$dateString" }
                        }
                    }
                }
            },
            {
                $match: {
                    registerDate: { $gte: sixMonthsAgoDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m', date: '$registerDate', timezone: '+05:30' }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);
        const labels = [];
        const userCountsData = [];
        const currentDateMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        for (let i = 0; i < 6; i++) {
            const month = (currentDateMonth - i) <= 0 ? 12 + (currentDateMonth - i) : currentDateMonth - i;
            const year = (currentDateMonth - i) <= 0 ? currentYear - 1 : currentYear;
            const formattedDate = `${year}-${month < 10 ? '0' + month : month}`;
            labels.unshift(formattedDate);
            const countData = userCounts.find(item => item._id === formattedDate);
            userCountsData.unshift(countData ? countData.count : 0);
        }
        res.json({ labels, userCounts: userCountsData });
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.pieChartDataGet = async (req, res) => {
    try {
        const productData = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    productCount: { $sum: 1 }
                }
            }
        ]);

        const colors = ['#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300'];

        const pieChartData = productData.map((item, index) => ({
            categoryName: item._id,
            productCount: item.productCount,
            color: index < colors.length ? colors[index] : getRandomColor(),
        }));
        res.json(pieChartData);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}