import { useState, useCallback, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { Button, Popup, Form, Input, Address, TextArea } from "@nutui/nutui-react-taro";
import TopBar from "../../components/TopBar";
import addressApi from "../../api/address";
import { AddressItem, AddressAddIn, AddressEditIn, AddressIdParam } from "../../api/address/types";
import CityList from "../../utils/CityList";
import { Del, Plus, Edit } from "@nutui/icons-react-taro";
import './index.scss'; // 假设有样式文件

const AddressManage = () => {
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
    refreshAddressList();
  }, []);

  const refreshAddressList = useCallback(() => {
    setLoading(true);
    addressApi.lists().then((res) => {
      setAddressList(res || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    });
  }, []);

  const handleCityChange = useCallback((value: any, params: any) => {
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

  const handleSetDefault = useCallback((id?: number ) => {
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

  return (
    <View className="min-h-screen bg-gray-50">
      <TopBar title="地址管理" showBack />

      <View className="flex flex-col gap-2 p-2">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-md font-bold">我的地址</Text>
          <Button
            shape="square"
            fill="outline"
            type="primary"
            icon={<Plus size={10} color="#ff0f23" />}
            style={{ margin: 8 }}
            onClick={() => {
              setAddVisible(true);
            }}
          >
            添加地址
          </Button>
        </View>
        {loading ? <Text className="text-center">加载中...</Text> : null}
        <View className="flex flex-col gap-2">
          {addressList.map((item: AddressItem) => (
            <View
              key={item.id}
              className="flex flex-row justify-between items-start bg-white p-3 rounded-md shadow-sm"
            >
              <View className="flex-1">
                <View className="flex flex-row gap-2 mb-1">
                  <Text className="font-medium">{item.name}</Text>
                  <Text className="text-gray-700">{item.phone}</Text>
                  {item.is_default === 1 && <Text className="text-green-600 text-xs">默认</Text>}
                </View>
                <View className="text-gray-700 text-sm">
                  <Text>{`${item.province}${item.city}${item.district}${item.address}`}</Text>
                </View>
              </View>
              <View className="flex flex-row gap-1 ml-2">
                {!item.is_default && (
                  <Button
                    shape="square"
                    fill="outline"
                    type="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(item.id);
                    }}
                  >
                    设置默认
                  </Button>
                )}
                <Button
                  shape="square"
                  fill="outline"
                  type="info"
                  size="small"
                  icon={<Edit size={14} color="#1589f7" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(item);
                  }}
                />
                <Button
                  shape="square"
                  fill="none"
                  type="danger"
                  size="small"
                  icon={<Del size={18} color="#ff0f23" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 添加地址 Popup */}
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
            <Button nativeType="submit" type="primary" block onClick={() => addForm.submit()}>
              保存
            </Button>
          }
          onFinish={handleAdd}
          onFinishFailed={(error) => {
            Taro.showToast({ title: JSON.stringify(error), icon: 'none' });
          }}
        >
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input className="!bg-gray-100" placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input className="!bg-gray-100" placeholder="请输入手机号" type="tel" />
          </Form.Item>
          <Form.Item label="选择位置" name="full_address" rules={[{ required: true, message: '请选择位置' }]}>
            <Input
              className="!bg-gray-100"
              value={selectedCity}
              placeholder="请选择位置"
              onFocus={() => setCityVisible(true)}
              readOnly
            />
          </Form.Item>
          <Form.Item label="详细地址" name="address" rules={[{ required: true, message: '请输入详细地址' }]}>
            <TextArea className="!bg-gray-100" placeholder="请输入详细地址" />
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

      {/* 编辑地址 Popup */}
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
            <Button nativeType="submit" type="primary" block onClick={() => editForm.submit()}>
              保存
            </Button>
          }
          onFinish={handleEdit}
          onFinishFailed={(error) => {
            Taro.showToast({ title: JSON.stringify(error), icon: 'none' });
          }}
        >
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input className="!bg-gray-100" placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input className="!bg-gray-100" placeholder="请输入手机号" type="tel" />
          </Form.Item>
          <Form.Item label="选择位置" name="full_address" rules={[{ required: true, message: '请选择位置' }]}>
            <Input
              className="!bg-gray-100"
              value={selectedCity}
              placeholder="请选择位置"
              onFocus={() => setCityVisible(true)}
              readOnly
            />
          </Form.Item>
          <Form.Item label="详细地址" name="address" rules={[{ required: true, message: '请输入详细地址' }]}>
            <TextArea className="!bg-gray-100" placeholder="请输入详细地址" />
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