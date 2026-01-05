import { useState, useCallback, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import addressApi from "../../api/address";
import { AddressItem, AddressAddIn, AddressEditIn } from "../../api/address/types";
import CityList from "../../utils/CityList";
import { Del, Plus, Edit } from "@nutui/icons-react-taro";
import { Button, Popup, Field, Cell, Input, AreaPicker, Image } from "@taroify/core";

interface SelectAddressProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  selected: (item: AddressItem) => void;
}

const SelectAddress = ({ visible, setVisible, selected }: SelectAddressProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [addressList, setAddressList] = useState<AddressItem[]>([]);
  const [cityVisible, setCityVisible] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | undefined | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("请选择位置");

  // Form States
  const [addFormState, setAddFormState] = useState<Partial<AddressAddIn>>({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    address: "",
    is_default: 1,
  });

  const [editFormState, setEditFormState] = useState<Partial<AddressEditIn>>({
    id: 0,
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    address: "",
    is_default: 1,
  });

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

  const handleSelect = useCallback((item: AddressItem) => {
    selected(item);
    setVisible(false);
  }, [selected, setVisible]);

  const handleCityConfirm = useCallback((_values: string[], options: any[]) => {
    if (options && options.length >= 3) {
      const province = options[0]?.text || '';
      const city = options[1]?.text || '';
      const district = options[2]?.text || '';
      const full = `${province} ${city} ${district}`;

      setSelectedCity(full);

      if (addVisible) {
        setAddFormState(prev => ({ ...prev, province, city, district }));
      } else if (editVisible) {
        setEditFormState(prev => ({ ...prev, province, city, district }));
      }
      setCityVisible(false);
    }
  }, [addVisible, editVisible]);

  const validateForm = (values: Partial<AddressAddIn>) => {
    if (!values.name) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' });
      return false;
    }
    if (!values.phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return false;
    }
    if (!values.province || !values.city || !values.district) {
      Taro.showToast({ title: '请选择位置', icon: 'none' });
      return false;
    }
    if (!values.address) {
      Taro.showToast({ title: '请输入详细地址', icon: 'none' });
      return false;
    }
    return true;
  };

  const handleAddSubmit = useCallback(() => {
    if (!validateForm(addFormState)) return;

    const submitData = {
      ...addFormState,
      province: addFormState.province || '',
      city: addFormState.city || '',
      district: addFormState.district || '',
      name: addFormState.name || '',
      phone: addFormState.phone || '',
      address: addFormState.address || '',
      is_default: addFormState.is_default || 0,
    };

    addressApi.add(submitData).then((res) => {
      if (res) {
        Taro.showToast({ title: '添加成功', icon: 'success' });
        setAddVisible(false);
        setAddFormState({ name: "", phone: "", province: "", city: "", district: "", address: "", is_default: 1 });
        setSelectedCity("请选择位置");
        refreshAddressList();
      } else {
        Taro.showToast({ title: '添加失败', icon: 'none' });
      }
    }).catch(() => {
      Taro.showToast({ title: '添加失败', icon: 'none' });
    });
  }, [addFormState, refreshAddressList]);

  const handleEditSubmit = useCallback(() => {
    if (!editingId) return;
    if (!validateForm(editFormState)) return;

    const submitData = {
      ...editFormState,
      id: editingId,
      province: editFormState.province || '',
      city: editFormState.city || '',
      district: editFormState.district || '',
      name: editFormState.name || '',
      phone: editFormState.phone || '',
      address: editFormState.address || '',
      is_default: editFormState.is_default || 0,
    };

    addressApi.edit(submitData).then((res) => {
      if (res) {
        Taro.showToast({ title: '编辑成功', icon: 'success' });
        setEditVisible(false);
        setEditFormState({ id: 0, name: "", phone: "", province: "", city: "", district: "", address: "", is_default: 1 });
        setEditingId(null);
        setSelectedCity("请选择位置");
        refreshAddressList();
      } else {
        Taro.showToast({ title: '编辑失败', icon: 'none' });
      }
    }).catch(() => {
      Taro.showToast({ title: '编辑失败', icon: 'none' });
    });
  }, [editingId, editFormState, refreshAddressList]);

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
    setEditFormState({
      ...item,
      is_default: item.is_default || 0
    });
    setEditVisible(true);
    setAddVisible(false);
  }, []);

  const closeAdd = useCallback(() => {
    setAddVisible(false);
    setAddFormState({ name: "", phone: "", province: "", city: "", district: "", address: "", is_default: 1 });
    setSelectedCity("请选择位置");
  }, []);

  const closeEdit = useCallback(() => {
    setEditVisible(false);
    setEditFormState({ id: 0, name: "", phone: "", province: "", city: "", district: "", address: "", is_default: 1 });
    setEditingId(null);
    setSelectedCity("请选择位置");
  }, []);

  return (
    <>


      {/* 地址列表 Popup */}
      < Popup
        className="z-[1000]"
        open={visible}
        placement="bottom"
        style={{ height: '80%' }
        }
        onClose={() => setVisible(false)}
        rounded
      >
        <Popup.Close />
        <View className="flex flex-col gap-2 p-2 h-full">
          <View className="flex flex-row items-center justify-between p-2">
            <Text className="text-md font-bold">地址管理</Text>
            <Button
              variant="outlined"
              color="primary"
              size="mini"
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
          <View className="flex flex-col gap-2 overflow-y-auto pb-4">
            {addressList.map((item: AddressItem) => (
              <View
                key={item.id}
                className="flex flex-row justify-between items-start bg-gray-100 p-3 rounded-md"
                onClick={() => handleSelect(item)}
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
                      variant="outlined"
                      color="primary"
                      size="mini"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(item.id);
                      }}
                    >
                      设置默认
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="info"
                    size="mini"
                    icon={<Edit size={14} color="#1589f7" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(item);
                    }}
                  />
                  <Button
                    variant="text"
                    color="danger"
                    size="mini"
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
      </Popup >
      {/* 添加地址 Popup */}
      <View className="z-[1012]" style={'—popup-z-index: 1012'} >
        <Popup
          open={addVisible}
          placement="bottom"
          onClose={closeAdd}
          rounded
        >
          <Popup.Close />
          <View className="p-4 bg-white h-full flex flex-col">
            <Text className="text-lg font-bold text-center mb-4">添加地址</Text>
            <Cell.Group inset>
              <Field label="姓名">
                <Input
                  placeholder="请输入姓名"
                  value={addFormState.name}
                  onChange={(e) => setAddFormState({ ...addFormState, name: e.detail.value })}
                />
              </Field>
              <Field label="手机号">
                <Input
                  placeholder="请输入手机号"
                  type="number"
                  value={addFormState.phone}
                  onChange={(e) => setAddFormState({ ...addFormState, phone: e.detail.value })}
                />
              </Field>
              <Field label="选择位置" isLink onClick={() => setCityVisible(true)}>
                <Input
                  readonly
                  placeholder="请选择位置"
                  value={selectedCity}
                />
              </Field>
              <Field label="详细地址">
                <Input
                  placeholder="请输入详细地址"
                  value={addFormState.address}
                  onChange={(e) => setAddFormState({ ...addFormState, address: e.detail.value })}
                />
              </Field>
            </Cell.Group>
            <View className="mt-auto pt-4">
              <Button block color="primary" onClick={handleAddSubmit}>保存</Button>
            </View>
          </View>
        </Popup >
      </View>


      {/* 编辑地址 Popup */}
      < View className="z-[1012]" style={'—popup-z-index: 1012'} >
        <Popup
          open={editVisible}
          placement="bottom"
          onClose={closeEdit}
          rounded
        >
          <Popup.Close />
          <View className="p-4 bg-white h-full flex flex-col">
            <Text className="text-lg font-bold text-center mb-4">编辑地址</Text>
            <Cell.Group inset>
              <Field label="姓名">
                <Input
                  placeholder="请输入姓名"
                  value={editFormState.name}
                  onChange={(e) => setEditFormState({ ...editFormState, name: e.detail.value })}
                />
              </Field>
              <Field label="手机号">
                <Input
                  placeholder="请输入手机号"
                  type="number"
                  value={editFormState.phone}
                  onChange={(e) => setEditFormState({ ...editFormState, phone: e.detail.value })}
                />
              </Field>
              <Field label="选择位置" isLink onClick={() => setCityVisible(true)}>
                <Input
                  readonly
                  placeholder="请选择位置"
                  value={selectedCity}
                />
              </Field>
              <Field label="详细地址">
                <Input
                  placeholder="请输入详细地址"
                  value={editFormState.address}
                  onChange={(e) => setEditFormState({ ...editFormState, address: e.detail.value })}
                />
              </Field>
            </Cell.Group>
            <View className="mt-auto pt-4">
              <Button block color="primary" onClick={handleEditSubmit}>保存</Button>
            </View>
          </View>
        </Popup>
      </View >
      {/* 城市选择 Popup */}
      < View className="z-[1013]" style={'—popup-z-index: 1013'} >
        <Popup open={cityVisible} placement="bottom" onClose={() => setCityVisible(false)} rounded>
          <AreaPicker
            areaList={CityList}
            onConfirm={handleCityConfirm}
            onCancel={() => setCityVisible(false)}
          >
            <AreaPicker.Toolbar>
              <AreaPicker.Button>取消</AreaPicker.Button>
              <AreaPicker.Title>选择地址</AreaPicker.Title>
              <AreaPicker.Button>确认</AreaPicker.Button>
            </AreaPicker.Toolbar>
          </AreaPicker>
        </Popup>
      </View >
    </>
  );
};

export default SelectAddress;