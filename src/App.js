import React, { useRef, useState, useEffect } from 'react'
import { Row, Col, Upload, Input, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload

function App() {
  const [img, setImg] = useState(null)
  const [fontSize, setFontSize] = useState(24)
  const [offsetLeft, setOffsetLeft] = useState(32)
  const [offsetBottom, setOffsetBottom] = useState(32)
  const [gradientPosition, setGradientPosition] = useState(20)
  const [name, setName] = useState('')
  const canvasRef = useRef()

  useEffect(() => {
    if (img) {
      const fr = new FileReader()
      fr.onload = () => {
        const image = new Image()
        image.onload = () => {
          const { width, height } = image

          const canvas = canvasRef.current
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(image, 0, 0)
          const gradient = ctx.createLinearGradient(
            0,
            height + gradientPosition,
            0,
            0
          )
          gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
          gradient.addColorStop(0.0725, 'rgba(0, 0, 0, 0.94)')
          gradient.addColorStop(0.1245, 'rgba(0, 0, 0, 0.86)')
          gradient.addColorStop(0.1648, 'rgba(0, 0, 0, 0.78)')
          gradient.addColorStop(0.4026, 'rgba(0, 0, 0, 0.09)')
          gradient.addColorStop(0.44, 'rgba(0, 0, 0, 0.04)')
          gradient.addColorStop(0.52, 'rgba(0, 0, 0, 0)')
          ctx.globalCompositeOperation = 'source-atop'
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)

          ctx.font = `${fontSize}px Montserrat`
          ctx.globalCompositeOperation = 'lighten'
          ctx.fillStyle = '#fff'
          ctx.fillText(name, offsetBottom, height - offsetLeft)
        }
        image.src = fr.result
      }
      fr.readAsDataURL(img)
    }
  }, [img, name, fontSize, offsetLeft, offsetBottom, gradientPosition])

  return (
    <main>
      <Row>
        <Col span={12} offset={6}>
          <Dragger
            name="file"
            multiple={false}
            onChange={({ file: { originFileObj } }) => {
              setImg(originFileObj)
            }}
            accept="image/*"
            showUploadList={false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <Input
            addonBefore="Название"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            type="number"
            addonBefore="Размер шрифта"
            value={fontSize}
            onChange={e => setFontSize(+e.target.value)}
          />
          <Input
            type="number"
            addonBefore="Отступ снизу"
            value={offsetBottom}
            onChange={e => setOffsetBottom(+e.target.value)}
          />
          <Input
            type="number"
            addonBefore="Отступ слева"
            value={offsetLeft}
            onChange={e => setOffsetLeft(+e.target.value)}
          />
          <Input
            type="number"
            addonBefore="Позиция градиента"
            value={gradientPosition}
            onChange={e => setGradientPosition(+e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={2}>
          <canvas style={{ marginTop: 60 }} ref={canvasRef}></canvas>
          <Button
            type="primary"
            onClick={() => {
              canvasRef.current.toBlob(function (blob) {
                const url = URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.download = img.name
                link.href = url
                link.click()
                URL.revokeObjectURL(url)
              })
            }}>
            Download
          </Button>
        </Col>
      </Row>
    </main>
  )
}

export default App
