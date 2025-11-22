import { useState, useCallback, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { Button, Popup, Form, Input, Address, TextArea } from "@nutui/nutui-react-taro";
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
  const [selectedCity, setSelectedCity] = useState<string>("请选择位置");

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const initialAddValues = {
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    address: "",
    is_default: 1,
    full_address: "请选择位置"
  };

  const initialEditValues = { ...initialAddValues, id: 0 };

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

  const handleCityChange = useCallback((_value: any, params: any) => {
    if (params && params.length >= 3) {
      const province = params[0].text;
      const city = params[1].text;
      const district = params[2].text;
      const full = params.map((it: any) => it.text).join(' ');
      setSelectedCity(full);
      if (addVisible) {
        addForm.setFieldsValue({ province, city, district, full_address: full });
      } else if (editVisible) {
        editForm.setFieldsValue({ province, city, district, full_address: full });
      }
      setCityVisible(false);
    }
  }, [addVisible, editVisible, addForm, editForm]);

  const handleAdd = useCallback((values: AddressAddIn) => {
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
        addForm.resetFields();
        setSelectedCity("请选择位置");
        refreshAddressList();
      } else {
        Taro.showToast({ title: '添加失败', icon: 'none' });
      }
    }).catch(() => {
      Taro.showToast({ title: '添加失败', icon: 'none' });
    });
  }, [addForm, refreshAddressList]);

  const handleEdit = useCallback((values: AddressEditIn) => {
    if (!editingId) return;
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
        editForm.resetFields();
        setEditingId(null);
        setSelectedCity("请选择位置");
        refreshAddressList();
      } else {
        Taro.showToast({ title: '编辑失败', icon: 'none' });
      }
    }).catch(() => {
      Taro.showToast({ title: '编辑失败', icon: 'none' });
    });
  }, [editingId, editForm, refreshAddressList]);

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
    setSelectedCity(`${item.province} ${item.city} ${item.district}`);
    editForm.setFieldsValue({
      ...item,
      full_address: `${item.province} ${item.city} ${item.district}`,
      is_default: item.is_default || 0
    });
    setEditVisible(true);
    setAddVisible(false);
  }, [editForm]);

  const closeAdd = useCallback(() => {
    setAddVisible(false);
    addForm.resetFields();
    setSelectedCity("请选择位置");
  }, [addForm]);

  const closeEdit = useCallback(() => {
    setEditVisible(false);
    editForm.resetFields();
    setEditingId(null);
    setSelectedCity("请选择位置");
  }, [editForm]);

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
                type="primary"
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
            shape="square"
            fill="outline"
            type="primary"
            icon={<Plus size={14} color="#ff0f23" />}
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
                type="primary"
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
                      shape="square"
                      fill="outline"
                      type="primary"
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
                      shape="square"
                      fill="outline"
                      type="info"
                      size="small"
                      icon={<Edit size={14} color="#1589f7" />}
                      className="!rounded-lg transition-transform duration-200 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(item);
                      }}
                    />
                    <Button
                      shape="square"
                      fill="outline"
                      type="danger"
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
        closeable
        title="添加地址"
        position="bottom"
        visible={addVisible}
        onClose={closeAdd}
      >
        <Form
          form={addForm}
          labelPosition="right"
          divider
          initialValues={initialAddValues}
          footer={
            <Button
              nativeType="submit"
              type="primary"
              block
              className="!rounded-lg transition-transform duration-200 active:scale-95"
              onClick={() => addForm.submit()}
            >
              保存
            </Button>
          }
          onFinish={handleAdd}
          onFinishFailed={() => {
            Taro.showToast({ title: '请完善表单信息', icon: 'none' });
          }}
        >
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input className="!bg-gray-50 !rounded-lg" placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input className="!bg-gray-50 !rounded-lg" placeholder="请输入手机号" type="tel" />
          </Form.Item>
          <Form.Item label="选择位置" name="full_address" rules={[{ required: true, message: '请选择位置' }]}>
            <Input
              className="!bg-gray-50 !rounded-lg"
              value={selectedCity}
              placeholder="请选择位置"
              onFocus={() => setCityVisible(true)}
              readOnly
            />
          </Form.Item>
          <Form.Item label="详细地址" name="address" rules={[{ required: true, message: '请输入详细地址' }]}>
            <TextArea className="!bg-gray-50 !rounded-lg" placeholder="请输入详细地址" />
          </Form.Item>
        </Form>
        <Address
          title="选择地址"
          options={CityList}
          visible={cityVisible && addVisible}
          onChange={handleCityChange}
          onClose={() => setCityVisible(false)}
        />
      </Popup>

      {/* Edit Address Popup */}
      <Popup
        className="!z-[1002]"
        closeable
        title="编辑地址"
        position="bottom"
        visible={editVisible}
        onClose={closeEdit}
      >
        <Form
          form={editForm}
          labelPosition="right"
          divider
          initialValues={initialEditValues}
          footer={
            <Button
              nativeType="submit"
              type="primary"
              block
              className="!rounded-lg transition-transform duration-200 active:scale-95"
              onClick={() => editForm.submit()}
            >
              保存
            </Button>
          }
          onFinish={handleEdit}
          onFinishFailed={() => {
            Taro.showToast({ title: '请完善表单信息', icon: 'none' });
          }}
        >
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input className="!bg-gray-50 !rounded-lg" placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input className="!bg-gray-50 !rounded-lg" placeholder="请输入手机号" type="tel" />
          </Form.Item>
          <Form.Item label="选择位置" name="full_address" rules={[{ required: true, message: '请选择位置' }]}>
            <Input
              className="!bg-gray-50 !rounded-lg"
              value={selectedCity}
              placeholder="请选择位置"
              onFocus={() => setCityVisible(true)}
              readOnly
            />
          </Form.Item>
          <Form.Item label="详细地址" name="address" rules={[{ required: true, message: '请输入详细地址' }]}>
            <TextArea className="!bg-gray-50 !rounded-lg" placeholder="请输入详细地址" />
          </Form.Item>
        </Form>
        <Address
          title="选择地址"
          options={CityList}
          visible={cityVisible && editVisible}
          onChange={handleCityChange}
          onClose={() => setCityVisible(false)}
        />
      </Popup>
    </View>
  );
};

export default AddressManage;