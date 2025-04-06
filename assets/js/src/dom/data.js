// Data module để lưu trữ các instance của các element khác nhau
// Ví dụ
// elementMap = {
//     btn1: {
//         'button': instance1,
//     },
// }

const elementMap = new Map();

const Data = {
    set(element, key, instance) {
        // Kiểm tra xem element đã tồn tại trong map chưa
        if (!elementMap.has(element)) {
            elementMap.set(element, new Map());
        }

        // Lấy instanceMap từ element
        const instanceMap = elementMap.get(element);

        // Kiểm tra xem instanceMap đã tồn tại key chưa
        if (!instanceMap.has(key) && instanceMap.size !== 0) {
            console.error(
                'Không thể thêm nhiều instance cho cùng một key trong một element'
            );
            return;
        }

        // Thêm instance vào instanceMap
        instanceMap.set(key, instance);
    },

    get(element, key) {
        if (!elementMap.has(element)) {
            return null;
        }

        const instanceMap = elementMap.get(element);

        if (!instanceMap.has(key)) {
            return null;
        }

        return instanceMap.get(key);
    },

    remove(element, key) {
        if (!elementMap.has(element)) {
            return;
        }

        const instanceMap = elementMap.get(element);

        if (instanceMap.has(key)) {
            instanceMap.delete(key);
        }

        // Nếu instanceMap không còn key nào thì xóa element khỏi map
        if (instanceMap.size === 0) {
            elementMap.delete(element);
        }
    },
};

export default Data;
