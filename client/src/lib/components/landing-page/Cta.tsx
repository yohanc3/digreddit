import { Input } from '../ui/input';

export default function Cta() {
    return (
        <section className="bg-[#576F72] py-20 text-white ">
            <div className="px-4 text-center flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-6">Newsletter</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    We have a newsletter system where we ask you guys for
                    feedback, and launch surveys to know what features to
                    prioritize!
                </p>
                <div className="w-[15rem] flex">
                    <Input
                        className="text-black bg-slate-100"
                        type="email"
                        placeholder="Email"
                    />
                </div>
            </div>
        </section>
    );
}
