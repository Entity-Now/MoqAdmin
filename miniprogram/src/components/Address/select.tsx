import { useState, useCallback, useEffect } from "react";

import { View, Text } from "@tarojs/components";
import useUserStore from "../../store/useUser";
import addressApi from "../../api/address";
import { AddressItem } from "../../api/address/types";
import { addressUtil } from "../../utils/address";
import { Del, Plus, Transit } from "@nutui/icons-react-taro";
import { AddressEdit } from '@nutui/nutui-biz'
import { ActionSheet, Button, Popup } from "@nutui/nutui-react-taro";

const select = ({ visible, setVisible, selected }) => {
  const [addressInfo, setAddressInfo] = useState<any>({
    name: "",
    tel: "",
    region: "",
    regionIds: [],
    address: "",
    default: false,
  });
  const addressData: any = {
    addressSelect: [],
    addressTitle: "选择所在地区",
    province: [
      { id: 1, name: "北京", title: "B" },
      { id: 2, name: "广西", title: "G" },
      { id: 3, name: "江西", title: "J" },
      { id: 4, name: "四川", title: "S" },
      { id: 5, name: "浙江", title: "Z" },
    ],
    city: [
      { id: 7, name: "朝阳区", title: "C" },
      { id: 8, name: "崇文区", title: "C" },
      { id: 9, name: "昌平区", title: "C" },
      { id: 6, name: "石景山区", title: "S" },
      { id: 3, name: "八里庄街道", title: "B" },
      { id: 10, name: "北苑", title: "B" },
    ],
    country: [
      { id: 3, name: "八里庄街道", title: "B" },
      { id: 9, name: "北苑", title: "B" },
      { id: 4, name: "常营乡", title: "C" },
    ],
    town: [],
    type: "custom",
  };
  const [modelVisible, setModelVisible] = useState(false);
  const [addressList, setAddressList] = useState<any>([]);
  const addressSetData = {
    namePlaceholder: "请输入收件人姓名",
    isRequired: ["name", "tel", "region", "address"],
    isDefualtAddress: true,
  };
  useEffect(() => {
    addressApi.lists().then((res) => {
      setAddressList(res || []);
    });
  }, []);
  const handleSelect = (item: AddressItem) => {
    selected(item);
    setVisible(false);
  }
  return (
    <>
      <Popup className="!z-[1002]" closeable title="添加地址" position="bottom" visible={modelVisible} onClose={() => setModelVisible(false)}>
        <AddressEdit address={addressData} addressInfo={addressInfo} data={addressSetData}>
        </AddressEdit>
      </Popup>
      <Popup
        className="z-[1000]"
        closeable
        title="选择地址"
        position="bottom"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <View className="flex flex-col gap-2 p-2">
          <View className="flex flex-row items-center justify-between">
            <View className="text-md font-bold">地址管理</View>
            <Button
              shape="square"
              fill="outline"
              type="primary"
              icon={<Plus size={10} color="#ff0f23" />}
              style={{
                margin: 8,
              }}
              onClick={() => setModelVisible(true)}
            >
              添加地址
            </Button>
          </View>
          <View className="flex flex-col gap-2">
            {addressList.map((item: AddressItem) => (
              <View key={item.id} onClick={() => handleSelect(item)} className="flex flex-row justify-between bg-gray-100 p-2 rounded-md">
                <View className="flex flex-col">
                  <View className="flex flex-row gap-2">
                    <Text>{item.name}</Text>
                    <Text className="text-gray-700">{item.phone}</Text>
                  </View>
                  <View className="text-gray-700">
                    <Text>{item.province}</Text>
                    <Text>{item.city}</Text>
                    <Text>{item.district}</Text>
                    <Text>{item.address}</Text>
                  </View>
                </View>
                <View>
                  <Button
                    shape="square"
                    fill="none"
                    type="primary"
                    icon={<Del size={18} color="#ff0f23" />}
                    style={{
                      margin: 8,
                    }}
                  >
                  </Button>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Popup>
    </>
  );
};

export default select;
