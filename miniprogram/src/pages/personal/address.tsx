import { useState, useCallback, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { Button, Popup, Input, Textarea, Field, AreaPicker, Checkbox } from "@taroify/core";
import TopBar from "../../components/TopBar";
import addressApi from "../../api/address";
import { AddressItem, AddressAddIn, AddressEditIn } from "../../api/address/types";
import CityList from "../../utils/CityList";
import { Del, Plus, Edit, Location } from "@nutui/icons-react-taro";
import useUserStore from "../../store/useUser";
import './index.scss';

const AddressManage = () => {
  const userInfo = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [addressList, setAddressList] = useState<AddressItem[]>([]);
  const [cityVisible, setCityVisible] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | undefined | null>(null);


  const [addFormData, setAddFormData] = useState<AddressAddIn>({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    address: "",
    is_default: 1
  });
  const [editFormData, setEditFormData] = useState<AddressEditIn & { id: number }>({
    id: 0,
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    address: "",
    is_default: 1
  });
  const [fullAddressDisplay, setFullAddressDisplay] = useState("请选择位置");

  useEffect(() => {
    if (userInfo.isLogin()) {
      refreshAddressList();
    }
  }, []);

  const refreshAddressList = useCallback(() => {
    if (!userInfo.isLogin()) return;

    setLoading(true);
    addressApi.lists().then((res) => {
      setAddressList(res || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    });
  }, [userInfo]);

  const handleCityChange = useCallback((_values: string[], options: any[]) => {
    if (options && options.length >= 3) {
      const province = options[0]?.text || options[0] || '';
      const city = options[1]?.text || options[1] || '';
      const district = options[2]?.text || options[2] || '';
      const full = `${province} ${city} ${district}`;
      setFullAddressDisplay(full);
      if (addVisible) {
        setAddFormData(prev => ({ ...prev, province, city, district }));
      } else if (editVisible) {
        setEditFormData(prev => ({ ...prev, province, city, district }));
      }
      setCityVisible(false);
    }
  }, [addVisible, editVisible]);

  const handleAddSubmit = useCallback(() => {
    const values = addFormData;
    if (!values.name || !values.phone || !values.province || !values.address) {
      Taro.showToast({ title: '请完善表单信息', icon: 'none' });
      return;
    }
    const submitData = {
      ...values,
      province: values.province || '',
      city: values.city || '',
      district: values.district || ''
    };
    addressApi.add(submitData).then((res) => {
      if (res) {
        Taro.showToast({ title: '添加成功', icon: 'success' });
        setAddVisible(false);
        setAddFormData({
          name: "",
          phone: "",
          province: "",
          city: "",
          district: "",
          address: "",
          is_default: 1
        });
        setFullAddressDisplay("请选择位置");
        refreshAddressList();
      } else {
        Taro.showToast({ title: '添加失败', icon: 'none' });
      }
    }).catch(() => {
      Taro.showToast({ title: '添加失败', icon: 'none' });
    });
  }, [addFormData, refreshAddressList]);

  const handleEditSubmit = useCallback(() => {
    const values = editFormData;
    if (!editingId) return;
    if (!values.name || !values.phone || !values.province || !values.address) {
      Taro.showToast({ title: '请完善表单信息', icon: 'none' });
      return;
    }
    const submitData = {
      ...values,
      id: editingId,
      province: values.province || '',
      city: values.city || '',
      district: values.district || ''
    };
    addressApi.edit(submitData).then((res) => {
      if (res) {
        Taro.showToast({ title: '编辑成功', icon: 'success' });
        setEditVisible(false);
        setEditingId(null);
        setFullAddressDisplay("请选择位置");
        refreshAddressList();
      } else {
        Taro.showToast({ title: '编辑失败', icon: 'none' });
      }
    }).catch(() => {
      Taro.showToast({ title: '编辑失败', icon: 'none' });
    });
  }, [editingId, editFormData, refreshAddressList]);

  const handleDelete = useCallback((id?: number) => {
    if (!id) return;
    Taro.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          addressApi.delete({ id }).then((result) => {
            if (result) {
              Taro.showToast({ title: '删除成功', icon: 'success' });
              refreshAddressList();
            } else {
              Taro.showToast({ title: '删除失败', icon: 'none' });
            }
          }).catch(() => {
            Taro.showToast({ title: '删除失败', icon: 'none' });
          });
        }
      }
    });
  }, [refreshAddressList]);

  const handleSetDefault = useCallback((id?: number) => {
    if (!id) return;
    addressApi.setDefault({ id }).then((res) => {
      if (res) {
        Taro.showToast({ title: '设置默认成功', icon: 'success' });
        refreshAddressList();
      } else {
        Taro.showToast({ title: '设置失败', icon: 'none' });
      }
    }).catch(() => {
      Taro.showToast({ title: '设置失败', icon: 'none' });
    });
  }, [refreshAddressList]);

  const openEdit = useCallback((item: AddressItem) => {
    setEditingId(item.id);
    setFullAddressDisplay(`${item.province} ${item.city} ${item.district}`);
    setEditFormData({
      ...item,
      id: item.id || 0,
      is_default: item.is_default || 0,
      address: item.address || ""
    });
    setEditVisible(true);
    setAddVisible(false);
  }, []);

  const closeAdd = useCallback(() => {
    setAddVisible(false);
    setAddFormData({
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      address: "",
      is_default: 1
    });
    setFullAddressDisplay("请选择位置");
  }, []);

  const closeEdit = useCallback(() => {
    setEditVisible(false);
    setEditingId(null);
    setFullAddressDisplay("请选择位置");
  }, []);

  const handleLoginClick = useCallback(() => {
    Taro.navigateTo({ url: '/pages/login/login' });
  }, []);

  // Non-intrusive login guidance
  if (!userInfo.isLogin()) {
    return (
      <View className="min-h-screen bg-gray-50">
        <TopBar title="地址管理" showBack />

        <View className="p-4">
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm overflow-hidden">
            <View className="p-6 flex flex-col items-center justify-center gap-4">
              <View className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Location size={32} color="#3b82f6" />
              </View>
              <View className="flex flex-col items-center gap-2">
                <Text className="text-lg font-semibold text-gray-800">需要登录才能管理地址</Text>
                <Text className="text-sm text-gray-600 text-center">登录后即可添加、编辑和管理您的收货地址</Text>
              </View>
              <Button
                color="primary"
                className="!rounded-full !px-8 !py-2 transition-transform duration-200 active:scale-95"
                onClick={handleLoginClick}
              >
                立即登录
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <TopBar title="地址管理" showBack />

      <View className="flex flex-col gap-3 p-4">
        {/* Header with Add Button */}
        <View className="flex flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-800">我的地址</Text>
          <Button
            variant="outlined"
            color="primary"
            className="!rounded-lg transition-transform duration-200 active:scale-95"
            onClick={() => setAddVisible(true)}
          >
            添加地址
          </Button>
        </View>

        {/* Loading State */}
        {loading && (
          <View className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <View key={i} className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
                <View className="h-4 bg-gray-200 rounded w-1/2 mb-2"></View>
                <View className="h-3 bg-gray-200 rounded w-3/4"></View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loading && addressList.length === 0 && (
          <View className="bg-white rounded-xl shadow-sm overflow-hidden">
            <View className="p-8 flex flex-col items-center justify-center gap-4">
              <View className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Location size={40} color="#9ca3af" />
              </View>
              <View className="flex flex-col items-center gap-2">
                <Text className="text-base font-medium text-gray-800">暂无收货地址</Text>
                <Text className="text-sm text-gray-500">添加收货地址，享受便捷购物体验</Text>
              </View>
              <Button
                color="primary"
                className="!rounded-full !px-6 transition-transform duration-200 active:scale-95"
                onClick={() => setAddVisible(true)}
              >
                添加第一个地址
              </Button>
            </View>
          </View>
        )}

        {/* Address List */}
        {!loading && addressList.length > 0 && (
          <View className="flex flex-col gap-3">
            {addressList.map((item: AddressItem) => (
              <View
                key={item.id}
                className="flex flex-row justify-between items-start bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-blue-200"
              >
                <View className="flex-1 pr-2">
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <Text className="font-semibold text-gray-800">{item.name}</Text>
                    <Text className="text-gray-600">{item.phone}</Text>
                    {item.is_default === 1 && (
                      <View className="px-2 py-0.5 bg-green-100 rounded-full">
                        <Text className="text-xs font-medium text-green-700">默认</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex flex-row items-start gap-1">
                    <Location size={14} color="#6b7280" className="mt-0.5 flex-shrink-0" />
                    <Text className="text-sm text-gray-700 leading-relaxed">
                      {`${item.province}${item.city}${item.district}${item.address}`}
                    </Text>
                  </View>
                </View>

                <View className="flex flex-col gap-2">
                  {!item.is_default && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      className="!rounded-lg !text-xs transition-transform duration-200 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(item.id);
                      }}
                    >
                      设为默认
                    </Button>
                  )}
                  <View className="flex flex-row gap-2">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      icon={<Edit size={14} color="#1589f7" />}
                      className="!rounded-lg transition-transform duration-200 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(item);
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="danger"
                      size="small"
                      icon={<Del size={14} color="#ff0f23" />}
                      className="!rounded-lg transition-transform duration-200 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Add Address Popup */}
      <Popup
        className="!z-[1002]"
        placement="bottom"
        open={addVisible}
        onClose={closeAdd}
        rounded
      >
        <View className="p-4 bg-white">
          <View className="text-lg font-bold mb-4 text-center">添加地址</View>
          <View className="space-y-4">
            <Field label="姓名">
              <Input
                placeholder="请输入姓名"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.detail.value })}
              />
            </Field>
            <Field label="手机号">
              <Input
                placeholder="请输入手机号"
                type="digit"
                value={addFormData.phone}
                onChange={(e) => setAddFormData({ ...addFormData, phone: e.detail.value })}
              />
            </Field>
            <Field label="选择位置">
              <Input
                value={fullAddressDisplay}
                placeholder="请选择位置"
                onClick={() => setCityVisible(true)}
                readonly
              />
            </Field>
            <Field label="详细地址">
              <Textarea
                placeholder="请输入详细地址"
                value={addFormData.address}
                onChange={(e) => setAddFormData({ ...addFormData, address: e.detail.value })}
              />
            </Field>
            <Field label="默认地址" align="center">
              <Checkbox
                checked={addFormData.is_default === 1}
                onChange={(checked) => setAddFormData({ ...addFormData, is_default: checked ? 1 : 0 })}
              />
            </Field>
          </View>
          <View className="mt-6">
            <Button
              color="primary"
              block
              className="!rounded-lg transition-transform duration-200 active:scale-95"
              onClick={handleAddSubmit}
            >
              保存
            </Button>
          </View>
        </View>

        <Popup open={cityVisible && addVisible} placement="bottom" onClose={() => setCityVisible(false)} rounded>
          <AreaPicker
            areaList={CityList}
            onConfirm={handleCityChange}
            onCancel={() => setCityVisible(false)}
          >
            <AreaPicker.Toolbar>
              <AreaPicker.Button>取消</AreaPicker.Button>
              <AreaPicker.Title>选择地址</AreaPicker.Title>
              <AreaPicker.Button>确认</AreaPicker.Button>
            </AreaPicker.Toolbar>
          </AreaPicker>
        </Popup>
      </Popup>

      {/* Edit Address Popup */}
      <Popup
        className="!z-[1002]"
        placement="bottom"
        open={editVisible}
        onClose={closeEdit}
        rounded
      >
        <View className="p-4 bg-white">
          <View className="text-lg font-bold mb-4 text-center">编辑地址</View>
          <View className="space-y-4">
            <Field label="姓名">
              <Input
                placeholder="请输入姓名"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.detail.value })}
              />
            </Field>
            <Field label="手机号">
              <Input
                placeholder="请输入手机号"
                type="digit"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.detail.value })}
              />
            </Field>
            <Field label="选择位置">
              <Input
                value={fullAddressDisplay}
                placeholder="请选择位置"
                onClick={() => setCityVisible(true)}
                readonly
              />
            </Field>
            <Field label="详细地址">
              <Textarea
                placeholder="请输入详细地址"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.detail.value })}
              />
            </Field>
            <Field label="默认地址" align="center">
              <Checkbox
                checked={editFormData.is_default === 1}
                onChange={(checked) => setEditFormData({ ...editFormData, is_default: checked ? 1 : 0 })}
              />
            </Field>
          </View>
          <View className="mt-6">
            <Button
              color="primary"
              block
              className="!rounded-lg transition-transform duration-200 active:scale-95"
              onClick={handleEditSubmit}
            >
              保存
            </Button>
          </View>
        </View>

        <Popup open={cityVisible && editVisible} placement="bottom" onClose={() => setCityVisible(false)} rounded>
          <AreaPicker
            areaList={CityList}
            onConfirm={handleCityChange}
            onCancel={() => setCityVisible(false)}
          >
            <AreaPicker.Toolbar>
              <AreaPicker.Button>取消</AreaPicker.Button>
              <AreaPicker.Title>选择地址</AreaPicker.Title>
              <AreaPicker.Button>确认</AreaPicker.Button>
            </AreaPicker.Toolbar>
          </AreaPicker>
        </Popup>
      </Popup>
    </View>
  );
};

export default AddressManage;