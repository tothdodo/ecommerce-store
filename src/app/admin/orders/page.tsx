import db from "@/db/db";
import { PageHeader } from "../_components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { MoreVertical } from "lucide-react";
import { DeleteDropDownItem } from "../orders/_components/OrderActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function getOrders() {
    return db.order.findMany({
        select: {
            id: true,
            pricePaidInCents: true,
            user: { select: { email: true } },
            product: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" }
    });
}

export default function OrdersPage() {
    return (
        <>
            <PageHeader>Orders</PageHeader>
            <OrdersTable />
        </>
    )
}

async function OrdersTable() {
    const orders = await getOrders();

    if (orders.length === 0) {
        return <p>No orders found.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableHead>Product Name</TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableHeader>
            <TableBody>
                {
                    orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell>{order.product.name}</TableCell>
                            <TableCell>{order.user.email}</TableCell>
                            <TableCell>{formatCurrency(order.pricePaidInCents / 100)}</TableCell>
                            <TableCell className="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical />
                                        <span className="sr-only">Actions</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DeleteDropDownItem id={order.id} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}