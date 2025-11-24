import mongoose from 'mongoose';

class PaymentRepository {
    constructor() {
        this.historyModel = mongoose.model('History');
    }

    async getPaymentsByUser(userId) {
        try {
            // Get all relationships for the user
            const relationships = await mongoose.model('Relation').find({
                $or: [{ renterId: userId }, { ownerId: userId }]
            });

            const relationIds = relationships.map(rel => rel._id);

            // Get all payment history for these relationships
            const payments = await this.historyModel
                .find({ relationId: { $in: relationIds } })
                .populate('relationId')
                .sort({ date: -1 });

            return payments;
        } catch (error) {
            throw new Error(`Failed to get payments: ${error.message}`);
        }
    }

    async getPaymentById(paymentId) {
        try {
            const payment = await this.historyModel
                .findById(paymentId)
                .populate('relationId');
            return payment;
        } catch (error) {
            throw new Error(`Failed to get payment: ${error.message}`);
        }
    }
}

export default PaymentRepository;
