export default function Stats() {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#576F72] mb-2">
                            1M+
                        </div>
                        <p className="text-gray-600">Posts Scanned Daily</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#576F72] mb-2">
                            10s
                        </div>
                        <p className="text-gray-600">Average Lead Delivery</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#576F72] mb-2">
                            94%
                        </div>
                        <p className="text-gray-600">Lead Accuracy Rate</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#576F72] mb-2">
                            120+
                        </div>
                        <p className="text-gray-600">Active Users</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
