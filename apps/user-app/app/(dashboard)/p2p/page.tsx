import prisma from "@repo/db/client";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { SendCard } from "../../../components/SendCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getP2ptxn() {
    const session = await getServerSession(authOptions)
    const txns = await prisma.p2pTransfer.findMany({
        where : {
            toUserId : Number(session?.user?.id)
        }
    })
    
    return txns.map(t=> ({
        time: t.timestamp,
        amount: t.amount,
        status: String(t.id),
        provider: String(t.fromUserId)
    }))
}

export default async function() {
    const transactions = await getP2ptxn()
    console.log(transactions);
    
    return <div className="w-screen">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
            <SendCard />
        </div>
        <div>
            <div className="pt-4">
                <OnRampTransactions transactions={transactions} />
            </div>
        </div>
    </div>
</div>
}