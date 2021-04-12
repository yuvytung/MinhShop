import {combineReducers} from 'redux';
import {loadingBarReducer as loadingBar} from 'react-redux-loading-bar';

import locale, {LocaleState} from './locale';
import authentication, {AuthenticationState} from './authentication';
import applicationProfile, {ApplicationProfileState} from './application-profile';

import administration, {AdministrationState} from 'app/modules/administration/administration.reducer';
import userManagement, {UserManagementState} from 'app/modules/administration/user-management/user-management.reducer';
import register, {RegisterState} from 'app/modules/account/register/register.reducer';
import activate, {ActivateState} from 'app/modules/account/activate/activate.reducer';
import password, {PasswordState} from 'app/modules/account/password/password.reducer';
import settings, {SettingsState} from 'app/modules/account/settings/settings.reducer';
import passwordReset, {PasswordResetState} from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import postDetails, {PostDetailsState} from 'app/entities/post-details/post-details.reducer';
// prettier-ignore
import simplePost, {SimplePostState} from 'app/entities/simple-post/simple-post.reducer';
// prettier-ignore
import typePost, {TypePostState} from 'app/entities/type-post/type-post.reducer';
// prettier-ignore
import typePostFilter, {TypePostFilterState} from 'app/entities/type-post-filter/type-post-filter.reducer';
// prettier-ignore
// prettier-ignore
import file, {FileState} from 'app/entities/file/file.reducer';
// prettier-ignore
import payment, {PaymentState} from 'app/entities/payment/payment.reducer';
// prettier-ignore
import bill, {BillState} from 'app/entities/bill/bill.reducer';
// prettier-ignore
import userOtherInfo, {UserOtherInfoState} from 'app/entities/user-other-info/user-other-info.reducer';
// prettier-ignore
import hanhChinhVN, {HanhChinhVNState} from 'app/entities/hanh-chinh-vn/hanh-chinh-vn.reducer';
// prettier-ignore
import post, {PostState} from 'app/entities/post/post.reducer';
import cartShop, {CartState} from 'app/modules/shopcart/reducers/cart.reducers';
//todo test shopcart
import orderShop, {OrderState} from 'app/modules/shopcart/reducers/order.reducers';
//todo test shopcart
import productShop, {ProductState} from 'app/modules/shopcart/reducers/products.reducer';

// prettier-ignore
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState
{
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly postDetails: PostDetailsState;
  readonly simplePost: SimplePostState;
  readonly typePost: TypePostState;
  readonly typePostFilter: TypePostFilterState;
  readonly file: FileState;
  readonly payment: PaymentState;
  readonly bill: BillState;
  readonly userOtherInfo: UserOtherInfoState;
  readonly hanhChinhVN: HanhChinhVNState;
  readonly post: PostState;

  readonly cartShop: CartState;
  readonly orderShop: OrderState;
  readonly productShop: ProductState;

  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  postDetails,
  simplePost,
  typePost,
  typePostFilter,
  file,
  payment,
  bill,
  userOtherInfo,
  hanhChinhVN,
  post,
  cartShop,
  orderShop,
  productShop,

  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
