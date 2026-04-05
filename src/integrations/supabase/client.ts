// Local storage-based client (replacing Supabase)
// Provides a compatible interface for portfolio content storage

class LocalStorageTable {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getData(): any[] {
    const data = localStorage.getItem(`table_${this.tableName}`);
    return data ? JSON.parse(data) : [];
  }

  private saveData(data: any[]) {
    localStorage.setItem(`table_${this.tableName}`, JSON.stringify(data));
  }

  select(columns = '*') {
    return {
      order: (column: string, options?: any) => {
        return {
          then: async (callback: any) => {
            const data = this.getData();
            if (options?.ascending === false) {
              data.sort((a, b) => new Date(b[column]).getTime() - new Date(a[column]).getTime());
            } else {
              data.sort((a, b) => new Date(a[column]).getTime() - new Date(b[column]).getTime());
            }
            callback({ data, error: null });
          },
          catch: () => {}
        };
      },
      eq: (column: string, value: any) => {
        return {
          then: async (callback: any) => {
            const data = this.getData().filter(item => item[column] === value);
            callback({ data, error: null });
          },
          catch: () => {}
        };
      },
      then: async (callback: any) => {
        const data = this.getData();
        callback({ data, error: null });
      },
      catch: () => {}
    };
  }

  insert(data: any) {
    return {
      select: () => {
        const executeInsert = async () => {
          const allData = this.getData();
          const newItem = {
            ...data,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          allData.push(newItem);
          this.saveData(allData);
          return newItem;
        };

        return {
          single: () => executeInsert().then(newItem => ({ data: newItem, error: null })),
          then: async (callback: any) => {
            const newItem = await executeInsert();
            callback({ data: newItem, error: null });
          },
          catch: () => {}
        };
      }
    };
  }

  update(data: any) {
    return {
      eq: (column: string, value: any) => ({
        select: () => {
          const executeUpdate = async () => {
            const allData = this.getData();
            const index = allData.findIndex(item => item[column] === value);
            if (index !== -1) {
              allData[index] = {
                ...allData[index],
                ...data,
                updated_at: new Date().toISOString(),
              };
              this.saveData(allData);
              return { data: allData[index], error: null };
            }
            return { data: null, error: { message: 'Not found' } };
          };

          return {
            single: () => executeUpdate(),
            then: async (callback: any) => {
              const result = await executeUpdate();
              callback(result);
            },
            catch: () => {}
          };
        }
      })
    };
  }

  delete() {
    return {
      eq: (column: string, value: any) => {
        const allData = this.getData();
        const filtered = allData.filter(item => item[column] !== value);
        this.saveData(filtered);
        return {
          then: async (callback: any) => {
            callback({ error: null });
          },
          catch: () => {}
        };
      }
    };
  }
}

class LocalStorageDatabase {
  from(tableName: string) {
    return new LocalStorageTable(tableName);
  }

  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        // Simulate file upload
        return { error: null };
      },
      getPublicUrl: (path: string) => ({
        data: {
          publicUrl: `https://via.placeholder.com/400?text=${encodeURIComponent(path)}`
        }
      })
    })
  };
}

export const supabase = new LocalStorageDatabase();
