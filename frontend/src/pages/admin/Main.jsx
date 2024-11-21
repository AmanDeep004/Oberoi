import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import Footer from "../../components/admin/Footer";
import HotelList from "../../components/admin/HotelList";
import HotelModal from "../../components/admin/HotelModal";
import HotelDetail from "../../components/admin/HotelDetail";
import RoomModal from "../../components/admin/RoomModal";
import DeleteModal from "../../components/admin/DeleteModal";
import FoodModal from "../../components/admin/FoodModal";
import PackageModal from "../../components/admin/PackageModal";
import DecorModal from "../../components/admin/DecorModal";
import EntertainmentModal from "../../components/admin/EntertainmentModal";
import Dashboard from "../../components/admin/Dashboard";
import UserRequirements from "../../components/admin/UserRequirements";
import {
  useDeleteHotelMutation,
  useGetHotelQuery,
} from "../../app/api/hotelSlice";
import { useDeleteFoodPackageMutation } from "../../app/api/admin/foodPackageSlice";
import { useDeleteEntertainmentMutation } from "../../app/api/admin/entertainmentItemsSlice";
import { useDeleteDecorMutation } from "../../app/api/admin/decorSlice";
import { useDeleteFoodMutation } from "../../app/api/admin/foodItemsSlice";
import { useDeleteRoomMutation } from "../../app/api/admin/roomSlice";
import { useDeleteUserMutation } from "../../app/api/admin/userSlice";
import Toast from "../../helpers/Toast";
import UserList from "../../components/admin/UserList";
import UserModal from "../../components/admin/UserModal";
import Top from "../../components/admin/Top";
import ViewUserRequirement from "../../components/admin/ViewUserRequirement";
import { useEffect } from "react";
import Reports from "../../components/admin/Reports";
import CampaignDetails from "../../components/admin/CampaignDetails";
import AddCampaign from "../../components/admin/AddCampaign";
import useAuth from "../../app/hooks/useAuth";
const Main = ({ page }) => {
  const [state, setState] = useState(page || "Hotel");
  const [modal, setModal] = useState("");
  const [hotelData, setHotelData] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [refreshObj, setRefreshObj] = useState();
  const [roomIndex, setRoomIndex] = useState();
  const [userItem, setUserItem] = useState(false);

  const [deleteHtl] = useDeleteHotelMutation();
  const [deleteFoodPackage] = useDeleteFoodPackageMutation();
  const [deleteEntertainment] = useDeleteEntertainmentMutation();
  const [delDecor] = useDeleteDecorMutation();
  const [delFood] = useDeleteFoodMutation();
  const [delRoom] = useDeleteRoomMutation();
  const [delUser] = useDeleteUserMutation();

  const {
    data: hotelList,
    isloading,
    isSuccess,
    isError,
    error,
    refetch: refreshHotel,
  } = useGetHotelQuery();

  const userData = useAuth();
  // console.log(userData.roleId, "userData_MainRoleId");
  const roleId = userData.roleId;

  const deleteHotel = async (id) => {
    try {
      if (roleId !== 1) {
        Toast("You don't have access to delete hotel", "warning");
        setModal("");
        return;
      }
      const res = await deleteHtl(id);
      Toast("Deleted Successfully", "success");
    } catch (error) {
      console.log(error);
      Toast("Something went wrong", "error");
    } finally {
      setModal("");
      refreshHotel();
    }
  };
  const deleteRoom = async (hotelId, roomId) => {
    console.log(hotelData?._id, "hotelId...", roomId, "room ids");
    try {
      const res = await delRoom({ hotelId, roomId });
      Toast("Deleted Successfully", "success");
    } catch (error) {
      console.log(error, "error");
      Toast("Something went wrong", "error");
    } finally {
      setModal("");
      refreshObj?.refresh();
    }
  };
  const deleteFoodPkg = async (id) => {
    try {
      const res = await deleteFoodPackage(id);
      Toast("Deleted Successfully", "success");
    } catch (error) {
      console.log(error);
      Toast("Something went wrong", "error");
    } finally {
      setModal("");
      refreshObj?.refresh();
    }
  };
  const deleteEnter = async (id) => {
    try {
      const res = await deleteEntertainment(id);
      Toast("Deleted Successfully", "success");
    } catch (error) {
      console.log(error);
      Toast("Something went wrong", "error");
    } finally {
      setModal("");
      refreshObj?.refresh();
    }
  };
  const deleteDecor = async (id) => {
    try {
      const res = await delDecor(id);
      Toast("Deleted Successfully", "success");
    } catch (error) {
      console.log(error);
      Toast("Something went wrong", "error");
    } finally {
      setModal("");
      refreshObj?.refresh();
    }
  };
  const deleteFood = async (id) => {
    try {
      const res = await delFood(id);
      Toast("Deleted Successfully", "success");
    } catch (error) {
      console.log(error);
      Toast("Something went wrong", "error");
    } finally {
      setModal("");
      refreshObj?.refresh();
    }
  };
  const deleteUser = async (id) => {
    try {
      const res = await delUser(id);
      Toast("Deleted Successfully", "success");
    } catch (error) {
      console.log(error);
      Toast("Something went wrong", "error");
    } finally {
      setModal("");
    }
  };

  useEffect(() => {
    if (isSuccess) refreshHotel();
  }, []);

  return (
    isSuccess && (
      <div className="DBLightBg backend-dashboard">
        <Header
          setState={(state) => {
            setState(state);
          }}
        />
        <Sidebar
          handleChange={(state) => {
            setState(state);
          }}
          currentState={state}
        />
        <section className="dasboard-rightArea-UI DBLightBg main">
          <div className="container-fluid pl-60 pr-40 vh-88 overflow-scroll">
            {state == "Hotel" && (
              <HotelList
                hotelList={hotelList}
                refreshHotel={refreshHotel}
                setState={(state) => {
                  setState(state);
                }}
                setHotelData={(data) => {
                  setHotelData(data);
                }}
                setModal={(state) => {
                  setModal(state);
                }}
                setSelectedItem={(item) => {
                  setSelectedItem(item);
                }}
                roleId={roleId}
              />
            )}
            {state == "HotelDetails" && hotelData && (
              <HotelDetail
                hotelData={hotelList.data.allHotels.find(
                  (x) => x._id == hotelData._id
                )}
                setState={(state) => {
                  setState(state);
                }}
                setHotelData={(data) => {
                  setHotelData(data);
                }}
                setModal={(state) => {
                  setModal(state);
                }}
                setSelectedItem={(item) => {
                  setSelectedItem(item);
                }}
                setRefreshObj={(obj) => {
                  setRefreshObj(obj);
                }}
                setRoomIndex={(index) => {
                  setRoomIndex(index);
                }}
              />
            )}
            {state === "UserReq" && (
              <UserRequirements
                setModal={(state) => {
                  setModal(state);
                }}
                setSelectedItem={(item) => {
                  setSelectedItem(item);
                }}
                setUserItem={setUserItem}
              />
            )}

            {state == "Dashboard" && <Dashboard />}

            {state == "Users" && (
              <UserList
                setModal={(state) => {
                  console.log(state, "state");
                  setModal(state);
                }}
                setSelectedItem={(item) => {
                  setSelectedItem(item);
                }}
              />
            )}

            {state == "Top" && <Top />}

            {state == "Reports" && <Reports />}
            {state == "Campaign" && (
              <CampaignDetails
                setModal={(state) => {
                  console.log(state, "state");
                  setModal(state);
                }}
                setSelectedItem={(item) => {
                  setSelectedItem(item);
                }}
              />
            )}
          </div>
        </section>
        <Footer />

        {modal == "AddHotel" && (
          <HotelModal
            onClose={() => {
              setModal("");
              refreshHotel();
            }}
            edit={false}
            roleId={roleId}
          />
        )}
        {modal == "EditHotel" && (
          <HotelModal
            onClose={() => {
              setModal("");
              refreshHotel();
            }}
            initValues={hotelData}
            edit={true}
          />
        )}
        {modal == "DeleteHotel" && (
          <DeleteModal
            onClose={() => {
              setModal("");
            }}
            onSuccess={() => {
              deleteHotel(selectedItem?._id);
            }}
          />
        )}

        {modal == "AddRoom" && (
          <RoomModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            hotelId={hotelData?._id}
            edit={false}
          />
        )}
        {modal == "EditRoom" && (
          <RoomModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            hotelId={hotelData?._id}
            initValues={{
              ...selectedItem,
              hotelId: hotelData?._id,
              roomIndex: roomIndex,
            }}
            edit={true}
            roleId={roleId}
          />
        )}
        {modal == "DeleteRoom" && (
          <DeleteModal
            onClose={() => {
              setModal("");
            }}
            onSuccess={() => {
              deleteRoom(hotelData?._id, selectedItem?.roomId);
            }}
          />
        )}

        {modal == "AddFoodItem" && (
          <FoodModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            hotelId={hotelData?._id}
            // initValues={selectedItem}
            edit={false}
          />
        )}
        {modal == "EditFoodItem" && (
          <FoodModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            hotelId={hotelData?._id}
            initValues={{
              ...selectedItem,
              categoryId: selectedItem.categoryId?._id,
            }}
            edit={true}
          />
        )}
        {modal == "DeleteFoodItem" && (
          <DeleteModal
            onClose={() => {
              setModal("");
            }}
            onSuccess={() => {
              deleteFood(selectedItem?._id);
            }}
          />
        )}

        {modal == "AddFoodPackage" && (
          <PackageModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            hotelId={hotelData?._id}
            edit={false}
          />
        )}
        {modal == "EditFoodPackage" && (
          <PackageModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            initValues={{
              _id: selectedItem._id,
              name: selectedItem.name,
              hotelId: selectedItem.hotelId,
              foodCategories: selectedItem.foodCategories.map((category) => ({
                categoryId: category.categoryId._id,
                quantity: category.quantity,
              })),
            }}
            hotelId={hotelData?._id}
            edit={true}
          />
        )}
        {modal == "DeleteFoodPackage" && (
          <DeleteModal
            onClose={() => {
              setModal("");
            }}
            onSuccess={() => {
              deleteFoodPkg(selectedItem?._id);
            }}
          />
        )}

        {modal == "AddDecor" && (
          <DecorModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            // initValues={selectedItem}
            hotelId={hotelData?._id}
            edit={false}
          />
        )}
        {modal == "EditDecor" && (
          <DecorModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            initValues={selectedItem}
            hotelId={hotelData?._id}
            edit={true}
          />
        )}
        {modal == "DeleteDecor" && (
          <DeleteModal
            onClose={() => {
              setModal("");
            }}
            onSuccess={() => {
              deleteDecor(selectedItem?._id);
            }}
          />
        )}

        {modal == "AddEntertainment" && (
          <EntertainmentModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            initValues={selectedItem}
            hotelId={hotelData?._id}
            edit={false}
          />
        )}
        {modal == "EditEntertainment" && (
          <EntertainmentModal
            onClose={() => {
              setModal("");
              refreshObj?.refresh();
            }}
            initValues={{
              ...selectedItem,
              categoryId: selectedItem.categoryId?._id,
            }}
            hotelId={hotelData?._id}
            edit={true}
          />
        )}
        {modal == "DeleteEntertainment" && (
          <DeleteModal
            onClose={() => {
              setModal("");
            }}
            onSuccess={() => {
              deleteEnter(selectedItem?._id);
            }}
          />
        )}
        {modal == "AddUser" && (
          <UserModal
            onClose={() => {
              setModal("");
            }}
            hotelData={hotelData}
            edit={false}
          />
        )}
        {modal == "EditUser" && (
          <UserModal
            onClose={() => {
              setModal("");
            }}
            hotelData={hotelData}
            edit={true}
            initValues={selectedItem}
          />
        )}
        {modal == "DeleteUser" && (
          <DeleteModal
            onClose={() => {
              setModal("");
            }}
            onSuccess={() => {
              deleteUser(selectedItem?._id);
            }}
          />
        )}

        {modal == "AddCampaign" && (
          <AddCampaign
            onClose={() => {
              setModal("");
            }}
          />
        )}

        {userItem && (
          <ViewUserRequirement
            data={userItem}
            onClose={() => {
              setUserItem(false);
            }}
          />
        )}
      </div>
    )
  );
};

export default Main;
