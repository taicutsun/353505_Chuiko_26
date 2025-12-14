import { useParams, Link } from "react-router-dom";

interface CatalogItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  specifications?: {
    [key: string]: string;
  };
  features: string[];
}

const mockCatalogItems: CatalogItem[] = [
  {
    id: 1,
    name: "Laptop Pro",
    description:
      "High-performance laptop for professionals with cutting-edge technology and premium build quality.",
    price: 1299.99,
    category: "Electronics",
    image: "https://via.placeholder.com/600x400/2563eb/ffffff?text=Laptop",
    specifications: {
      Processor: "Intel Core i7-12700H",
      Memory: "16GB DDR5",
      Storage: "512GB NVMe SSD",
      Display: '15.6" FHD IPS',
      Graphics: "NVIDIA RTX 3060",
      Battery: "Up to 8 hours",
    },
    features: [
      "Thunderbolt 4 connectivity",
      "Backlit keyboard",
      "Fingerprint reader",
      "Wi-Fi 6E support",
      "Aluminum chassis",
    ],
  },
  {
    id: 2,
    name: "Wireless Mouse",
    description:
      "Ergonomic wireless mouse with long battery life and precision tracking.",
    price: 49.99,
    category: "Accessories",
    image: "https://via.placeholder.com/600x400/10b981/ffffff?text=Mouse",
    specifications: {
      Connectivity: "Bluetooth 5.0 + 2.4GHz",
      Battery: "AA battery (6 months)",
      DPI: "1600 adjustable",
      Buttons: "6 programmable",
      Weight: "95g",
    },
    features: [
      "Silent click technology",
      "Ambidextrous design",
      "Plug-and-play",
      "Energy efficient",
    ],
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    description:
      "RGB mechanical keyboard with cherry switches for premium typing experience.",
    price: 149.99,
    category: "Accessories",
    image: "https://via.placeholder.com/600x400/f59e0b/ffffff?text=Keyboard",
    specifications: {
      Switches: "Cherry MX Red",
      Layout: "TKL (87 keys)",
      Backlight: "Per-key RGB",
      Connectivity: "USB-C",
      Cable: "Detachable 1.8m",
    },
    features: [
      "Customizable RGB lighting",
      "Anti-ghosting",
      "N-key rollover",
      "Aluminum frame",
      "Software for customization",
    ],
  },
  {
    id: 4,
    name: "4K Monitor",
    description:
      "27-inch 4K UHD monitor with HDR support for stunning visual clarity.",
    price: 399.99,
    category: "Electronics",
    image: "https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Monitor",
    specifications: {
      Display: '27" 4K UHD (3840x2160)',
      Panel: "IPS",
      "Refresh Rate": "60Hz",
      HDR: "HDR10",
      Connectivity: "HDMI 2.0, DisplayPort 1.4",
      Stand: "Height adjustable",
    },
    features: [
      "99% sRGB coverage",
      "Flicker-free technology",
      "Blue light filter",
      "Picture-in-Picture",
      "VESA mount compatible",
    ],
  },
  {
    id: 5,
    name: "USB-C Hub",
    description:
      "7-in-1 USB-C hub with multiple ports for ultimate connectivity.",
    price: 79.99,
    category: "Accessories",
    image: "https://via.placeholder.com/600x400/ef4444/ffffff?text=Hub",
    specifications: {
      Ports: "2x USB-A, 1x HDMI, 1x SD, 1x microSD",
      "Power Delivery": "100W",
      HDMI: "4K @ 30Hz",
      Material: "Aluminum",
      "Cable Length": "15cm",
    },
    features: [
      "Plug-and-play",
      "Compact design",
      "Overheat protection",
      "LED indicators",
      "Mac and PC compatible",
    ],
  },
  {
    id: 6,
    name: "Webcam HD",
    description:
      "1080p HD webcam with auto-focus for crystal clear video calls.",
    price: 89.99,
    category: "Electronics",
    image: "https://via.placeholder.com/600x400/06b6d4/ffffff?text=Webcam",
    specifications: {
      Resolution: "1080p @ 30fps",
      "Field of View": "90°",
      Focus: "Auto-focus",
      Microphone: "Dual stereo",
      Connectivity: "USB-A",
    },
    features: [
      "Auto light correction",
      "Noise reduction",
      "Clip-on mount",
      "Wide-angle lens",
      "Plug-and-play",
    ],
  },
];

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const item = mockCatalogItems.find((item) => item.id === parseInt(id || ""));

  if (!item) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ color: "#dc2626", marginBottom: "1rem" }}>
          Item not found
        </h1>
        <p>The requested item could not be found in our catalog.</p>
        <Link
          to="/catalog"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "0.375rem",
          }}
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 2rem" }}>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ flex: "1" }}>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        <div style={{ flex: "1" }}>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            {item.category}
          </div>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            {item.name}
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.6",
              color: "#4b5563",
              marginBottom: "1.5rem",
            }}
          >
            {item.description}
          </p>

          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#059669",
              marginBottom: "2rem",
            }}
          >
            ${item.price}
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <button
              style={{
                flex: "1",
                padding: "1rem",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }}
            >
              Add to Cart
            </button>

            <Link
              to="/catalog"
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                textDecoration: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "3rem auto 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
      >
        {item.specifications && (
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#1f2937",
              }}
            >
              Specifications
            </h2>
            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
              }}
            >
              {Object.entries(item.specifications).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    {key}
                  </span>
                  <span style={{ color: "#6b7280" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            Features
          </h2>
          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
            }}
          >
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.5rem",
                color: "#374151",
              }}
            >
              {item.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
