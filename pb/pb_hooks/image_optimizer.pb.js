/// <reference path="../pb_data/types.d.ts" />

const collections = ['products', 'stores'];

collections.forEach(collection => {
    onRecordCreateRequest((e) => {
        // Lógica de procesamiento de imágenes inline para evitar ReferenceError
        const collectionName = e.collection.name;
        const imageFields = collectionName === 'products' ? ['images'] : ['logo', 'banner'];

        imageFields.forEach(field => {
            try {
                const files = e.httpContext.file(field);
                if (!files || files.length === 0) return;

                files.forEach(file => {
                    if (!file.name.match(/\.(jpg|jpeg|png|webp)$/i)) return;

                    const tempId = $security.randomString(10);
                    const inputPath = `/tmp/in_${tempId}_${file.name}`;
                    const outputPath = `/tmp/out_${tempId}.webp`;

                    try {
                        $os.writeFile(inputPath, file.content());
                        // Usamos la ruta absoluta al script de node
                        const cmd = $os.exec("node", "/pb/pb_hooks/optimize.node", inputPath, outputPath);
                        
                        if (cmd.exitCode === 0) {
                            const optimizedBuffer = $os.readFile(outputPath);
                            const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
                            file.name = newName;
                            file.content = optimizedBuffer;
                            console.log(`[HOOK] ${collectionName} - Imagen optimizada: ${newName}`);
                        }
                    } catch (err) {
                        console.log("[HOOK ERROR] " + err);
                    } finally {
                        try { $os.remove(inputPath); } catch(e) {}
                        try { $os.remove(outputPath); } catch(e) {}
                    }
                });
            } catch (err) {}
        });
        return e.next();
    }, collection);

    onRecordUpdateRequest((e) => {
        // Repetir lógica o usar una función global (pero mejor inline para seguridad en Goja)
        // Por ahora, para QA, probaremos con Create.
        return e.next();
    }, collection);
});
