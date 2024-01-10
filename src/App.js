import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordLink from './pages/ResetPasswordLink';
import Register from './pages/Register';
import Error404 from './pages/Error404';
import ForbiddenPermits from './pages/ForbiddenPermits';
import SuspendedAccount from './pages/SuspendedAccount';
import CheckSession from './pages/CheckSession';
import AllNotifications from './pages/AllNotifications';
import AddUsers from './pages/AddUsers';
import CompletaRegistro from './pages/CompletaRegistro';
import Catalogo from './pages/Catalogo';
import CatalogoAdmin from './pages/CatalogoAdmin';
import Consumo from './pages/Consumo';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import EpnoPartnos from './pages/EpnoPartnos';
import FinanzasC from './pages/FinanzasC';
import FinanzasS from './pages/FinanzasS';
import GeneralServices from './pages/GeneralServices';
import MyOrder from './pages/MyOrder';
import MyThings from './pages/MyThings';
import ListMyPackagesDetails from './pages/ListMyPackagesDetails';
import OrderDetails from './pages/OrderDetails';
import ComplaintDetails from './pages/ComplaintDetails';
import Parts from './pages/Parts';
import PendingPartNos from './pages/PendingPartNos';
import ProductById from './pages/ProductById';
import RangeMarket from './pages/RangeMarket';
import Reviews from './pages/Reviews';
import SeguimientoOrdenes from './pages/SeguimientoOrdenes';
// import SeguimientoOrdenesService from './pages/SeguimientoOrdenesService';
import ShowProductsByCategory from './pages/ShowProductsByCategory';
import Solicitudes from './pages/Solicitudes';
import SolicitudSoftware from './pages/SolicitudSoftware';
import Users from './pages/Users';
import Ventas from './pages/Ventas';
import PendingVerification from './pages/PendingVerification';
import SeguimientoQuejas from './pages/SeguimientoQuejas';
import GetMerchant from './pages/Merchants/GET';
import NewMerchant from './pages/Merchants/POST';

import store from './store';
import { Provider } from 'react-redux';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path='' exact={true} element={<Login />} />
					<Route path='/register' exact={true} element={<Register />} />
					<Route path='reset'>
					<Route
                        path='password/:tokenUrl'
                        exact={true}
                        element={<ResetPassword />}
                    />
                    <Route
                        path=''
                        exact={true}
                        element={<ResetPasswordLink />}
                    />
					</Route>
                    <Route path='error'>
                        <Route path='401' exact={true} element={<ForbiddenPermits />} />
                        <Route path='404' exact={true} element={<Error404 />} />
                    </Route>
                    <Route
                        path='/check-session'
                        exact={true}
                        element={<CheckSession />}
                    />
                    <Route path='merchants'>
                        <Route
                            path=':id'
                            exact={true}
                            element={<GetMerchant />}
                        />
                        <Route
                            path='new'
                            exact={true}
                            element={<NewMerchant />}
                        />
                    </Route>
                    <Route
                        path='/@a-@n'
                        exact={true}
                        element={<AllNotifications />}
                    />
                    <Route path='/@a-@u' exact={true} element={<AddUsers />} />
                    <Route
                        path='/@c-@r/:role'
                        exact={true}
                        element={<CompletaRegistro />}
                    />
                    <Route path='/catalog' exact={true} element={<Catalogo />} />
                    <Route
                        path='/@c-@a'
                        exact={true}
                        element={<CatalogoAdmin />}
                    />
                    <Route path='/@cns' exact={true} element={<Consumo />} />
                    <Route path='/@p/:id' exact={true} element={<Profile />} />
                    <Route path='/dashboard' exact={true} element={<Dashboard />} />
                    <Route
                        path='/@e-@p'
                        exact={true}
                        element={<EpnoPartnos />}
                    />
                    <Route path='/@f-@c' exact={true} element={<FinanzasC />} />
                    <Route path='/@f-@s' exact={true} element={<FinanzasS />} />
                    <Route path='/@m-@o' exact={true} element={<MyOrder />} />
                    <Route path='/@m-@t' exact={true} element={<MyThings />} />
                    <Route
                        path='/@m-@p/:id'
                        exact={true}
                        element={<ListMyPackagesDetails />}
                    />
                    <Route
                        path='/@q-@d/:id'
                        exact={true}
                        element={<ComplaintDetails />}
                    />
                    <Route path='/@p' exact={true} element={<Parts />} />
                    <Route
                        path='/@p-@p'
                        exact={true}
                        element={<PendingPartNos />}
                    />
                    <Route
                        path='/@p-@d/:id/:category'
                        exact={true}
                        element={<ProductById />}
                    />
                    <Route path='/@m' exact={true} element={<RangeMarket />} />
                    <Route path='/@rev' exact={true} element={<Reviews />} />
                    <Route path='orders'>
                        <Route
                            path='all/:type'
                            exact={true}
                            element={<SeguimientoOrdenes />}
                        />
                        <Route
                            path='details/:id'
                            exact={true}
                            element={<OrderDetails />}
                        />
                        <Route
							path="request"
							exact={true}
							element={<GeneralServices />}
						/>
                    </Route>
                    <Route
                        path='/@q'
                        exact={true}
                        element={<SeguimientoQuejas />}
                    />
                    {/* <Route path='/@o-@s/:service' exact={true} element={<SeguimientoOrdenesService/>} /> */}
                    <Route
                        path='/@c-@p/:category'
                        exact={true}
                        element={<ShowProductsByCategory />}
                    />
                    <Route path='/@s' exact={true} element={<Solicitudes />} />
                    <Route
                        path='/@s-@s'
                        exact={true}
                        element={<SolicitudSoftware />}
                    />
                    <Route path='/@u' exact={true} element={<Users />} />
                    <Route path='/@v' exact={true} element={<Ventas />} />
                    <Route path='account'>
                        <Route
                            path='unverified'
                            exact={true}
                            element={<PendingVerification />}
                        />
                        <Route
                            path='suspended'
                            exact={true}
                            element={<SuspendedAccount />}
                        />
                    </Route>
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
