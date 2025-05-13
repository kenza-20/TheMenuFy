function VisualPlate({ items }) {
    return (
        <div
            className="relative w-64 h-64 rounded-full bg-white shadow-lg overflow-hidden border-4 border-yellow-500 mx-auto"
            style={{ position: 'relative', width: '256px', height: '256px', borderRadius: '50%' }}
        >
            <img
                src="/images/plate.png"
                alt="Assiette"
                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
            />
            {items.map((item, index) => (
                <img
                    key={index}
                    src={item.image}
                    alt={item.name}
                    style={{
                        position: 'absolute',
                        width: '64px',
                        height: '64px',
                        objectFit: 'contain',
                        top: `${30 + (index * 40) % 100}px`,
                        left: `${30 + (index * 50) % 100}px`,
                        zIndex: 1 + index,
                    }}
                />
            ))}
        </div>
    );
}

export default VisualPlate;