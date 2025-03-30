export { default as Onboarding } from './Onboarding';

export * from './Shop';
export * from './Home';

// Export Profile screens with proper structure
import { Profile } from './Profile';
import { EditProfile } from './Profile/EditProfile';
Profile.EditProfile = EditProfile;

export {
    Profile,
};

export * from './Auth';
export * from './Order';

// Cart screens
export { CartPage as CartScreen } from './Cart/CartPage';
export { default as CartDetailView } from './Cart/CartDetailView';

export * from './Cart';
export * from './Checkout';
export * from './Notification';
export * from './Reviews';
