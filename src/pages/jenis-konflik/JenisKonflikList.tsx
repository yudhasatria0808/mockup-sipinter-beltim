import { useState } from "react";
import { useNavigate } from "react-router";
import { ListPage } from "../../components/templates";
import { ActionButton } from "../../components/common";
import { type DataTableColumn } from "../../components/ui/table";
import { EditIcon, TrashIcon } from "../../components/icons";
import type { JenisKonflik } from "../../types/jenisKonflik";
import { mockJenisKonflik } from "./mockData";

export default function JenisKonflikList() {
  const navigate = useNavigate();
  const [data, setData] = useState<JenisKonflik[]>(mockJenisKonflik);

  const handleDelete = (item: JenisKonflik) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jenis konflik "${item.nama}"?`)) return;
    setData((prev) => prev.filter((d) => d.id !== item.id));
  };

  const columns: DataTableColumn<JenisKonflik>[] = [
    {
      key: "nama",
      header: "Nama Jenis Konflik",
      className: "font-medium text-gray-800 dark:text-white/90",
    },
    {
      key: "deskripsi",
      header: "Deskripsi",
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {item.deskripsi || "-"}
        </span>
      ),
    },
  ];

  return (
    <ListPage
      title="Master Data Jenis Konflik"
      metaDescription="Kelola Master Data Jenis Konflik"
      columns={columns}
      data={data}
      searchPlaceholder="Cari nama atau deskripsi..."
      filterFn={(item, search) =>
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(search.toLowerCase())
      }
      rowKey={(item) => item.id}
      onAdd={() => navigate("/jenis-konflik/create")}
      actions={(item) => (
        <>
          <ActionButton
            onClick={() => navigate(`/jenis-konflik/edit/${item.id}`)}
            icon={<EditIcon />}
            title="Edit"
            variant="primary"
          />
          <ActionButton
            onClick={() => handleDelete(item)}
            icon={<TrashIcon />}
            title="Hapus"
            variant="danger"
          />
        </>
      )}
    />
  );
}
