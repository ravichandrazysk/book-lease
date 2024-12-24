export interface ComicCardProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string | number;
  discounted_price: string;
  is_free: boolean;
  category: string;
  slug: string;
  images: { image_path: string }[];
  className?: string;
}
export interface PaginationDataTypes {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ExtendRentalDialogProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentDueDate?: Date | null;
  // eslint-disable-next-line no-unused-vars
  extendDays?: (dueDate: string) => void;
}

export interface CustomToastProps {
  title: string;
  description?: string;
  className?: string;
}

export interface CategoryTypes {
  id: 1;
  name: string;
  age: string;
}

export interface TagsTypes {
  id: number;
  name: string;
}

export interface FilterContentProps {
  onCategoryChange: React.Dispatch<React.SetStateAction<string[]>>;
  onTagChange: React.Dispatch<React.SetStateAction<string[]>>;
  onAgeGroupChange: React.Dispatch<React.SetStateAction<string[]>>;
  checkedCategories: string[];
  checkedTags: string[];
  checkedAgeGroups: string[];
}

export interface StockCardProps {
  variant: "rental" | "books" | "received" | "status" | "sold" | "sent";
  bookId?: number;
  title: string;
  author?: string;
  date?: string;
  imageUrl: string;
  status?: string;
  isAvailable?: boolean;
  imageError?: () => void;
  onEdit?: () => void;
  // eslint-disable-next-line no-unused-vars
  onToggle?: () => void;
  onAccept?: () => void;
  onCancel?: () => void;
  loader?: boolean;
}

export interface OwnerDetailsTypes {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  profile_photo: string | null;
}

export interface NotificationTypes {
  id: number;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  active: boolean;
}
export interface BookGroupProps {
  id: 1;
  name: string;
  max_books_count: number;
  books: ComicCardProps[];
}

export interface LeaseDetails {
  id: number;
  book_id: number;
  requester_id: number;
  owner_id: number;
  type: string;
  status: string;
  requested_at: string;
  responded_at: string;
  lease_end_date: string;
  created_at: string;
  updated_at: string;
}

export interface BookDetailsType {
  id: number;
  owner: string;
  category: string;
  name: string;
  author: string;
  description: string;
  price: string;
  discounted_price: string;
  is_free: string;
  availability: string;
  slug: string;
  status: string;
  condition: string;
  approved_at: string;
  is_active: boolean;
  tags: string;
  is_requested: boolean;
  request_id: string | null;
  is_leased: boolean;
  is_buy: boolean;
  lease_details?: LeaseDetails;
  can_extend_lease: boolean;
  images: { image_path: string }[];
}

export interface BooCreateEditFormTypes {
  coverImage: File | null;
  title: string;
  author: string;
  description: string;
  category: string;
  tags: string;
  condition: string;
  age: string;
  availabilityType: "sell" | "rent" | "free";
  rentPrice?: string;
  sellPrice?: string;
  discountedRentPrice?: string;
  discountedSellPrice?: string;
  editingReason?: string;
  languages: { label: string; value: string }[];
}

export interface CategoryTypes {
  id: 1;
  name: string;
  age: string;
}
export interface TagsTypes {
  id: number;
  name: string;
}

export interface LanguagesTypes {
  id: number;
  name: string;
}

export interface MyBookTypes {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: number | null;
  discounted_price: string;
  is_free: boolean;
  active: boolean;
  slug: string;
  category: string;
  images: { image_path: string }[];
}

export interface MyRequestTypes {
  id: 4;
  book_name: string;
  requested_at: string;
  status: string;
  images: string[];
}

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  age: string;
  gender: string;
  address: string;
  state: string;
  city: string;
  profileImage: string | null;
}
export interface ReceivedRequestTypes {
  id: 4;
  book_name: string;
  requester: string;
  requested_at: string;
  status: string;
  type: string;
  images: string[];
}

export interface RentalBookProps {
  id: number;
  book: string;
  author: string;
  owner: string;
  lease_end_date: string;
  images: string[];
}

export interface SoldBookProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string;
  discounted_price: string;
  is_free: boolean;
  category: string;
  images: string[];
}

export interface SupportFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  requestType: string;
  comments: string;
}
