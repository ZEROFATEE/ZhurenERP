import { useState, useEffect } from "react";
import CustomerList from "@/components/CustomerList";
import CustomerAddTab from "@/components/CustomerAddTab";
import CustomerDetailTab from "@/components/CustomerDetailTab";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { getVendors, type Vendor } from "@/api/vendor";

export default function Customer() {
  const [customers, setCustomers] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVendors();
      setCustomers(data);
    } catch (err) {
      setError("Failed to load customers. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSaved = (newCustomer: Vendor) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setIsAddOpen(false);
  };

  const handleExpand = (customer: Vendor) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedCustomer(null);
  };

  // Filter customers by search
  const filtered = customers.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.account?.toLowerCase().includes(q) ||
      v.mailing_address?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Modals */}
      <CustomerAddTab
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleCustomerSaved}
      />

      <CustomerDetailTab
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        customer={selectedCustomer}
      />

      {/* Search & Add Button Row */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 h-10 text-sm text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg placeholder:text-gray-500"
          />
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-12 text-gray-500 text-sm">
          Loading customers...
        </div>
      )}
      {error && (
        <div className="text-center py-12 text-red-500 text-sm">{error}</div>
      )}
      {!loading && !error && (
        <CustomerList data={filtered} onExpand={handleExpand} />
      )}
    </div>
  );
}