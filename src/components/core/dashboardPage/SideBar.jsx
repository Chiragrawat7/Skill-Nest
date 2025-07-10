import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import SidebarLink from "./SidebarLink";
import {  useNavigate } from "react-router-dom";
import { useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";
const SideBar = () => {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  if (profileLoading || authLoading) {
    return <div className="mt-10">Loading</div>;
  }
  return (
    <div className=" text-white bg-richblack-800">
      <div className="hidden min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 lg:flex h-[calc[100vh-3.5rem)] bg-richblack-800 py-10">
        <div className=" flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink link={link} iconName={link.icon} key={link.id} />
            );
          })}
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600"/>

        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "dashboard/settings" }}
            iconName={"VscSettingsGear"}
          />
          <button
          className="text-sm font-medium text-richblack-300 mx-4 my-4"
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You Will Be logged out of yor Account",
                btn1Text: "Logout",
                btn2Text: "cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            <div className="flex items-center gap-x-2 p-4">
                <VscSignOut className="text-lg" />
                <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal&&<ConfirmationModal  modalData={confirmationModal}/>}
    </div>
  );
};

export default SideBar;
