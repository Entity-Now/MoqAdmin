import React, { useState, useEffect } from 'react'
import { View, Camera, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Popup, Button } from '@taroify/core'
import { Photograph, Image as ImageIcon, Close, Check, Refresh } from '@nutui/icons-react-taro'

interface SearchByImageProps {
    open: boolean
    onClose: () => void
    submit: (file: string) => void
}

export default function SearchByImage({ open, onClose, submit }: SearchByImageProps) {
    const [showCamera, setShowCamera] = useState(false)
    const [tempImage, setTempImage] = useState<string>('')

    useEffect(() => {
        if (!open) {
            setShowCamera(false)
            setTempImage('')
        }
    }, [open])

    // 选择相册（添加压缩）
    const handleChooseAlbum = async () => {
        try {
            const res = await Taro.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sourceType: ['album'],
                sizeType: ['compressed'],
            })
            if (res.tempFiles.length > 0) {
                setTempImage(res.tempFiles[0].tempFilePath)
            }
        } catch (error) {
            console.log('User cancelled or error:', error)
        }
    }

    // 打开相机（优化权限逻辑）
    const handleOpenCamera = () => {
        Taro.getSetting({
            success: (res) => {
                if (res.authSetting['scope.camera']) {
                    setShowCamera(true)
                } else {
                    Taro.showModal({
                        title: '提示',
                        content: '需要相机权限才能拍照，请在设置中打开权限',
                        success: (modalRes) => {
                            if (modalRes.confirm) {
                                Taro.openSetting()
                            }
                        }
                    })
                }
            },
            fail: () => {
                Taro.showToast({ title: '获取权限设置失败', icon: 'none' })
            }
        })
    }

    // 拍照
    const handleTakePhoto = () => {
        setTimeout(() => {
            const ctx = Taro.createCameraContext()
            ctx.takePhoto({
                quality: 'normal',
                success: (res) => {
                    setTempImage(res.tempImagePath)
                    setShowCamera(false)
                },
                fail: (err) => {
                    console.error('Take photo failed', err)
                    Taro.showToast({ title: '拍照失败', icon: 'none' })
                }
            })
        }, 500)
    }

    // 关闭相机
    const handleCloseCamera = () => {
        setShowCamera(false)
    }

    // 确认使用图片
    const handleConfirm = () => {
        if (tempImage) {
            submit(tempImage)
            onClose()
        }
    }

    // 重拍/重新已选
    const handleRetake = () => {
        setTempImage('')
        // 如果是直接从相机拍完预览的，可能用户想直接回相机？ 
        // 简单起见，回到选择面板，用户可以再选“拍照”或“相册”
    }

    return (
        <>
            <Popup
                open={open}
                placement="bottom"
                onClose={onClose}
                rounded
                style={{ paddingBottom: '30px', height: tempImage ? '80vh' : 'auto' }}
            >
                {/* 预览确认界面 */}
                {tempImage ? (
                    <View className="flex flex-col h-full bg-white rounded-t-lg relative">
                        <View className="flex-1 flex items-center justify-center p-4 bg-black/5">
                            <Image
                                src={tempImage}
                                mode="aspectFit"
                                className="w-full h-full rounded-lg"
                            />
                        </View>

                        <View className="flex justify-around items-center p-4 gap-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                            <Button
                                className="flex-1"
                                variant="outlined"
                                icon={<Refresh size={14} />}
                                onClick={handleRetake}
                            >
                                重选
                            </Button>
                            <Button
                                className="flex-1"
                                color="primary"
                                icon={<Check size={14} />}
                                onClick={handleConfirm}
                            >
                                确认搜索
                            </Button>
                        </View>

                        <View
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center"
                            onClick={onClose}
                        >
                            <Close color="#fff" size={16} />
                        </View>
                    </View>
                ) : (
                    /* 选择面板 */
                    !showCamera && (
                        <View className="flex flex-col p-4 bg-white rounded-t-lg">
                            <View className="text-center text-lg font-bold mb-6 text-gray-800">
                                以图搜图
                            </View>

                            <View className="flex justify-around items-center mb-8">
                                <View
                                    className="flex flex-col items-center justify-center gap-2 active:opacity-70"
                                    onClick={handleOpenCamera}
                                >
                                    <View className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                        <Photograph size={32} className="text-blue-500" />
                                    </View>
                                    <Text className="text-sm text-gray-600">拍照</Text>
                                </View>

                                <View
                                    className="flex flex-col items-center justify-center gap-2 active:opacity-70"
                                    onClick={handleChooseAlbum}
                                >
                                    <View className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                                        <ImageIcon size={32} className="text-green-500" />
                                    </View>
                                    <Text className="text-sm text-gray-600">相册</Text>
                                </View>
                            </View>

                            <Button
                                className="w-full"
                                size="large"
                                variant="outlined"
                                onClick={onClose}
                                style={{ border: 'none', backgroundColor: '#f5f5f5' }}
                            >
                                取消
                            </Button>
                        </View>
                    )
                )}

                {/* 自定义全屏相机视图 */}
                {showCamera && (
                    <View className="fixed inset-0 z-[1000] bg-black">
                        <Camera
                            mode="normal"
                            devicePosition="back"
                            flash="off"
                            style={{ width: '100%', height: '100%' }}
                            onError={(e) => console.error('Camera error:', e.detail)}
                        >
                            <View className="absolute bottom-10 left-0 right-0 flex justify-around items-center pb-10">
                                <View
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur"
                                    onClick={handleCloseCamera}
                                >
                                    <Close color="#fff" size={20} />
                                </View>

                                <View
                                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform"
                                    onClick={handleTakePhoto}
                                >
                                    <View className="w-16 h-16 rounded-full border-2 border-black" />
                                </View>

                                <View className="w-10 h-10" />
                            </View>
                        </Camera>
                    </View>
                )}
            </Popup>
        </>
    )
}