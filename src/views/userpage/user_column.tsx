import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui";
import { UserApi } from "@/features";
import Show from "@/lib/show";
import { UserRequest } from "@/models/requests/user_request";
import { UserList } from "@/models/responses/user_list";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  BadgeCheck,
  CircleX,
  MailCheck,
  MoreHorizontal,
  PencilLine,
  ShieldCheck,
  ShieldX,
  Trash2,
  User,
  UserPen,
} from "lucide-react";
import { Response } from "../../models/responses";

const roleList = [
  { id: 0, name: "Admin" },
  { id: 1, name: "Manager" },
  { id: 2, name: "Staff" },
  { id: 3, name: "Shipper" },
  { id: 4, name: "Customer" },
];

const convertRoleToNumber = (role: string) => {
  if (role === "Admin") return 0;
  if (role === "Manager") return 1;
  if (role === "Staff") return 2;
  if (role === "Shipper") return 3;
  if (role === "Customer") return 4;
  return 5;
};

const UserColumn = (
  handleEdit: (user: UserRequest) => void,
  onToast: (success: boolean, description: string) => void,
  refetch: () => void,
  role: string
): ColumnDef<UserList>[] => [
  {
    header: "No.",
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UserName
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "emailConfirm",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email Confirm
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <Show>
            <Show.When isTrue={row.original.emailConfirm === "Confirm"}>
              <BadgeCheck className="text-green-500" />
            </Show.When>
            <Show.Else>
              <CircleX className="text-red-500" />
            </Show.Else>
          </Show>
        </div>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "FullName",
    cell: ({ row }) => (
      <span>
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      return (
        <div>
          <Show>
            <Show.When isTrue={row.original.gender === "Male"}>
              <User className="text-blue-500" />
            </Show.When>
            <Show.Else>
              <User className="text-red-500" />
            </Show.Else>
          </Show>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div>
          <Show>
            <Show.When isTrue={row.original.status === "Available"}>
              <ShieldCheck className="text-green-500" />
            </Show.When>
            <Show.Else>
              <ShieldX className="text-red-500" />
            </Show.Else>
          </Show>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      if (role === "Staff") {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                const response: Response<null> = await UserApi.changeUserStatus(
                  user.id
                );
                if (response.statusCode === 200) {
                  onToast(true, "Change user status success");
                  refetch();
                } else {
                  onToast(false, "Change user status failed");
                }
              }}
            >
              <Show>
                <Show.When isTrue={user.status === "Available"}>
                  <ShieldX className="mr-2 size-4" />
                  Block
                </Show.When>
                <Show.Else>
                  <ShieldCheck className="mr-2 size-4" />
                  Access
                </Show.Else>
              </Show>
            </DropdownMenuItem>
            <Show>
              <Show.When isTrue={user.emailConfirm !== "Confirm"}>
                <DropdownMenuItem
                  onClick={async () => {
                    await UserApi.changeUserEmailConfirmed(user.id);
                    onToast(true, "Change email confirm");
                  }}
                >
                  <MailCheck className="mr-2 size-4" />
                  Confirm
                </DropdownMenuItem>
              </Show.When>
            </Show>
            <Show>
              <Show.When isTrue={role !== "Manager"}>
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <UserPen className="mr-2 size-4" /> Role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {roleList.map((role) => (
                          <DropdownMenuItem
                            key={role.id}
                            onClick={async () => {
                              await UserApi.changeUserRoles(user.id, role.id)
                                .then((res) => {
                                  if (res.data.statusCode === 200) {
                                    onToast(true, "Change role success");
                                  } else {
                                    onToast(false, "Change role failed");
                                  }
                                })
                                .catch(() =>
                                  onToast(false, "Change role failed")
                                );
                            }}
                          >
                            {role.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </Show.When>
            </Show>
            <DropdownMenuItem
              onClick={() => {
                handleEdit({
                  id: user.id,
                  email: user.email,
                  userName: user.userName,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  gender: user.gender === "Male" ? 1 : 0,
                  phone: user.phone,
                  address: user.address || "",
                  role: convertRoleToNumber(user.role),
                });
              }}
            >
              <PencilLine className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <Show>
              <Show.When isTrue={role !== "Manager"}>
                <DropdownMenuItem
                  onClick={async () => {
                    const success = await UserApi.deleteUser(user.id);
                    onToast(success, "Delete user");
                  }}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </Show.When>
            </Show>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default UserColumn;
