export interface LocationTypes {
  address: string;
  city: string;
  state: string;
  pincode: string;
}
export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  gender: string;
  address: string;
}
export interface ComicCardProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string | number;
  discounted_price: string;
  is_free: boolean;
  category:
    | {
        id: number;
        name: string;
      }
    | string;
  slug: string;
  images: {
    image_id: number;
    image_path: string;
    alt_text: string | null;
  }[];
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
  slug?: string;
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
  ticketId?: string;
  read_at?: string | null;
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
  ticket_number: string;
  owner_name: string;
  model_id: number;
  status: string;
}
export interface BookGroupProps {
  id: number;
  name: string;
  max_books_count: number;
  books: BookDataType[];
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
  ticket_number: string;
}

export interface BooCreateEditFormTypes {
  coverImage: File | string | null;
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

export interface BookConditionTypes {
  value: string;
  label: string;
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
  description: string;
  condition: string;
  category?: {
    id: number;
    name: string;
  };
  age_group?: "";
  tags: {
    id: number;
    name: string;
  }[];
  price: number | null;
  discounted_price: string;
  is_free: boolean;
  active: boolean;
  slug: string;
  images: { image_path: string }[];
}

export interface MyRequestTypes {
  id: 4;
  book_name: string;
  slug: string;
  requested_at: string;
  status: string;
  images: string[];
  book_owner: string;
  ticket_number: string;
  read_at: string | null;
}

export interface ContextTypes {
  refreshNotifications: boolean;
  setRefreshNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  changeProfile: boolean;
  setChangeProfile: React.Dispatch<React.SetStateAction<boolean>>;
  profileDetails: ProfileDetails;
  setProfileDetails: React.Dispatch<React.SetStateAction<ProfileDetails>>;
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
export interface ProfileDetails {
  address_line_1: string | null;
  age: number | null;
  city: string | null;
  coins: number | null;
  email: string | null;
  email_verified: boolean;
  first_name: string | null;
  gender: string | null;
  id: number;
  last_name: string | null;
  notification_counts: {
    my_requests: number | null;
    received_requests: number | null;
  };
  phone: string | null;
  phone_verified_at: string | null;
  pincode: number | null;
  profile_photo: string | null;
  state: string | null;
}
export interface ReceivedRequestTypes {
  id: 4;
  book_name: string;
  slug: string;
  requester: string;
  requested_at: string;
  status: string;
  type: string;
  images: string[];
  ticket_number: string;
  read_at: string | null;
}

export interface RentalBookProps {
  id: number;
  book: string;
  slug: string;
  author: string;
  owner: string;
  lease_end_date: string;
  images: string[];
}

export interface SoldBookProps {
  id: number;
  name: string;
  slug: string;
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

export interface BookArrayProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string;
  discounted_price: string;
  is_free: boolean;
  category: {
    id: number;
    name: string;
  };
  slug: string;
  images: {
    image_id: number;
    image_path: string;
    alt_text: string | null;
  }[];
}

export interface BookDataType {
  id: number;
  name: string;
  slug: string;
  author: string;
  availability: string;
  description: string | null;
  condition: string;
  price: string;
  discounted_price: string;
  sold_at?: string;
  is_free: boolean;
  category: {
    id: number;
    name: string;
  };
  age_group: string;
  tags: {
    id: number;
    name: string;
  }[];
  active: boolean;
  images: {
    image_id: number;
    image_path: string;
    alt_text: string | null;
  }[];
}

export interface Message {
  id: number;
  message: string;
  user: string;
  created_at: string;
  role: string;
}

export interface ChatBoxProps {
  owner: string;
  ticketId: number;
  isOwner: boolean;
}
