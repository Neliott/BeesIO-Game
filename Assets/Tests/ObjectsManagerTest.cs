using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEditor;
using UnityEngine;
using UnityEngine.TestTools;

public class ObjectsManagerTest
{
    /// <summary>
    /// Max update time to add objects for ObjectsManager + 0.3f
    /// </summary>
    const float TEST_WAIT_TIME = (1 / ObjectsManager.SPAWN_OBJECTS_RATE) + 0.3f;

    GameObject TestObjectPrefab
    {
        get => Resources.Load<GameObject>("Prefabs/TestObject");
    }

    [UnityTest]
    public IEnumerator ObjectsManager_Update_NoObjects()
    {
        //Given
        ObjectsManager objectManager = SpawnObjectsManager();
        Transform childrenContained = new GameObject().transform;
        objectManager.SetGenericObjectToSpawn(TestObjectPrefab);
        objectManager.SetSpawnedObjectsParent(childrenContained);
        int expectedCount = 0;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME); //Test update method
        //Then
        int actualCount = childrenContained.childCount;
        Assert.AreEqual(expectedCount, actualCount);
    }
    [Test]
    public void ObjectsManager_SpawnInitialObjects_CountEqual()
    {
        //Given
        ObjectsManager objectManager = SpawnObjectsManager();
        Transform childrenContained = new GameObject().transform;
        objectManager.SetGenericObjectToSpawn(TestObjectPrefab);
        objectManager.SetSpawnedObjectsParent(childrenContained);
        int expectedCount = ObjectsManager.TARGET_OBJECTS_AMOUNT;
        //When
        objectManager.CanSpanwObjects = true;
        //Then
        int actualCount = childrenContained.childCount;
        Assert.AreEqual(expectedCount, actualCount);
    }
    [UnityTest]
    public IEnumerator ObjectsManager_UpdateAfterSpawn_CountEqual()
    {
        //Given
        ObjectsManager objectManager = SpawnObjectsManager();
        Transform childrenContained = new GameObject().transform;
        objectManager.SetGenericObjectToSpawn(TestObjectPrefab);
        objectManager.SetSpawnedObjectsParent(childrenContained);
        int expectedCount = ObjectsManager.TARGET_OBJECTS_AMOUNT;
        //When
        objectManager.CanSpanwObjects = true;
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME); //Test update method
        //Then
        int actualCount = childrenContained.childCount;
        Assert.AreEqual(expectedCount, actualCount);
    }
    [UnityTest]
    public IEnumerator ObjectsManager_UpdateAddAfterSpawn_CountEqual()
    {
        //Given
        ObjectsManager objectManager = SpawnObjectsManager();
        Transform childrenContained = new GameObject().transform;
        objectManager.SetGenericObjectToSpawn(TestObjectPrefab);
        objectManager.SetSpawnedObjectsParent(childrenContained);
        int expectedCount = ObjectsManager.TARGET_OBJECTS_AMOUNT;
        objectManager.CanSpanwObjects = true;
        //When
        Object.Destroy(childrenContained.GetChild(0).gameObject); //Remove one object
        Object.Destroy(childrenContained.GetChild(childrenContained.childCount-2).gameObject); //Remove other object
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME*2); //Test update method (add two new objects)
        //Then
        int actualCount = childrenContained.childCount;
        Assert.AreEqual(expectedCount, actualCount);
    }

    ObjectsManager SpawnObjectsManager()
    {
        GameObject gm = new GameObject();
        ObjectsManager objectManager = gm.AddComponent<ObjectsManager>();
        return objectManager;
    }
}