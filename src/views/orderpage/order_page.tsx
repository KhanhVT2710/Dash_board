import { DataTable } from "@/components/common/data_table";
import DialogCustom from "@/components/common/dialog";
import { useToast } from "@/components/ui";
import useFetch from "@/hooks/useFetch";
import Show from "@/lib/show";
import { OrderGroupList, OrderList, Response } from "@/models/responses";
import { useState } from "react";
import OrderDetail from "./dialog/order_detail";
import StatusAccess from "./dialog/status_access";
import OrderColum from "./order_column";

const OrderPage = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [editStatus, setEditStatus] = useState<{ id: string; status: number }>({
    id: "",
    status: 0,
  });

  const { data: orders, refetch } =
    useFetch<Response<OrderList[]>>("/api/order/get-all");

  const sortedData = orders?.data?.sort((a, b) => {
    return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
  });

  const { data: orderGroup } = useFetch<Response<OrderGroupList[]>>(
    "/api/order-group/get-all"
  );

  const handleToast = (success: boolean, description: string) => {
    if (success) {
      toast({
        title: "success",
        description: description,
      });
      refetch();
    } else {
      toast({
        title: "error",
        description: description,
      });
    }
  };

  const handleDialog = async (id: string, status: number) => {
    setType("change");
    setEditStatus({ id, status });
    setIsDialogOpen(true);
  };

  const handleDetail = (id: string) => {
    setType("detail");
    setId(id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <DataTable
        columns={OrderColum(
          refetch,
          handleDialog,
          handleToast,
          handleDetail,
          orderGroup?.data ?? []
        )}
        data={sortedData ?? []}
        searchColumn="address"
      />
      <DialogCustom
        className="max-w-5xl p-6"
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        children={
          <Show>
            <Show.When isTrue={type === "change"}>
              <StatusAccess
                editStatus={editStatus}
                handleCloseDialog={handleCloseDialog}
                refetch={refetch}
                onToast={handleToast}
              />
            </Show.When>
            <Show.When isTrue={type === "detail"}>
            <OrderDetail
                id={id}
                onClose={handleCloseDialog}
                refetch={refetch}
              />
            </Show.When>
          </Show>
        }
      />
    </div>
  );
};

export default OrderPage;
